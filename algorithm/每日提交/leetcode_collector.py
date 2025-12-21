import requests
import json
import datetime
from datetime import timedelta
import os
import re  
from markdownify import markdownify as md

# 配置请求头
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Content-Type": "application/json",
    "Accept": "application/json",
}

csrf_token = "oV8usYaAj6kqeSvTv6WrYRNdHKMmT4fu"
session_id = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfYXV0aF91c2VyX2lkIjoiNDA1MzY0NCIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNjVmMmYxM2ZkZTI5ZGE1ZGYwOWI2M2JlODBhYjZkYjI2ZjhjMzUzMWNmNDllNGQ0Yjc1YzNkNDA0YWQ3ODQwYiIsImlkIjo0MDUzNjQ0LCJlbWFpbCI6IjExNDU5ODY4ODlAcXEuY29tIiwidXNlcm5hbWUiOiJ0aWFuemhlbmd4dWFueWkiLCJ1c2VyX3NsdWciOiJ0aWFuemhlbmd4dWFueWkiLCJhdmF0YXIiOiJodHRwczovL2Fzc2V0cy5sZWV0Y29kZS5jbi9hbGl5dW4tbGMtdXBsb2FkL3VzZXJzL3RpYW56aGVuZ3h1YW55aS9hdmF0YXJfMTYzNzQxNDk1MS5wbmciLCJwaG9uZV92ZXJpZmllZCI6dHJ1ZSwiZGV2aWNlX2lkIjoiNzNjNDg4YTk2ZDMzNWNiMDY0YzgzNjg3MGM4OThiOGMiLCJpcCI6IjIyMi45NS40Ni4xNjAiLCJfdGltZXN0YW1wIjoxNzY0OTg2NzY0LjU4Mzg3NTQsImV4cGlyZWRfdGltZV8iOjE3Njc1NTMyMDAsInZlcnNpb25fa2V5XyI6MX0.HseAOSREZny31TIXvauk3hYAknT0bU_DwFl_hcRxTRE"

# 添加通用GraphQL请求方法
def make_graphql_request(query, variables=None, operation_name=None, csrf_token=csrf_token, session_id=session_id):
    """发起LeetCode GraphQL请求的通用方法"""
    url = "https://leetcode.cn/graphql/"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Content-Type": "application/json",
        "Accept": "application/json",
        "x-csrftoken": csrf_token or "",
    }
    cookies = {}
    if session_id:
        cookies["LEETCODE_SESSION"] = session_id
    if csrf_token:
        cookies["XSRF-TOKEN"] = csrf_token
    
    payload = {
        "query": query,
        "variables": variables or {},
        "operationName": operation_name
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers, cookies=cookies)
        response.raise_for_status()  # 检查请求是否成功
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"GraphQL请求失败: {e}")
        return None

# 获取LeetCode提交记录
def get_leetcode_submissions(csrf_token, session_id, date):
    # 设置cookie
    cookies = {
        "LEETCODE_SESSION": session_id,
        "XSRF-TOKEN": csrf_token
    }
    
    # # 获取前一日的日期
    # yesterday = (datetime.datetime.now() - datetime.timedelta(days=1)).strftime('%Y-%m-%d')
    
    # 构建GraphQL查询
    query = """
    query userProgressQuestionList($filters: UserProgressQuestionListInput) {
  userProgressQuestionList(filters: $filters) {
    totalNum
    questions {
      translatedTitle
      frontendId
      title
      titleSlug
      difficulty
      lastSubmittedAt
      numSubmitted
      questionStatus
      lastResult
      topicTags {
        name
        nameTranslated
        slug
      }
    }
  }
}
    
    """
    operationName = "userProgressQuestionList"
    variables = {"filters": {"skip": 0, "limit": 50}}
    # 调用LeetCode GraphQL API
    data = make_graphql_request(query, variables, operationName)
    
    if "errors" in data:
        print(f"API错误: {data['errors']}")
        return []
    
    submissions = data.get("data", {}).get("userProgressQuestionList", {}).get("questions", [])
    
    # 过滤出前一日的提交
    yesterday_submissions = []
    for submission in submissions:
        submission_date = datetime.datetime.fromisoformat(submission["lastSubmittedAt"].replace('Z', '+00:00')).strftime('%Y-%m-%d')
        if submission_date == str(date):
            # 获取完整的提交代码
            submissionList = get_yesterday_submissions(submission["titleSlug"], date)
            for item in submissionList:
                if item["status"] == "AC":
                    submission_detail = get_submission_detail(item["id"])
                    item["code"] = submission_detail
            submission["submissionList"] = submissionList
            submission["question"] = get_question_detail(submission["titleSlug"])
            yesterday_submissions.append(submission)
    
    return yesterday_submissions

# 获取提交列表
def get_yesterday_submissions(question_slug, date):
    """
    获取指定题目的提交列表，并过滤出指定日期的提交
    :param question_slug: 题目slug
    :param date: 日期字符串，格式为 'YYYY-MM-DD'
    :return: 指定日期的提交列表
    """
    # 构建请求体
    payload = {
        "query": "\n    query submissionList($offset: Int!, $limit: Int!, $lastKey: String, $questionSlug: String!, $lang: String, $status: SubmissionStatusEnum) {\n  submissionList(\n    offset: $offset\n    limit: $limit\n    lastKey: $lastKey\n    questionSlug: $questionSlug\n    lang: $lang\n    status: $status\n  ) {\n    lastKey\n    hasNext\n    submissions {\n      id\n      title\n      status\n      statusDisplay\n      lang\n      langName: langVerboseName\n      runtime\n      timestamp\n      url\n      isPending\n      memory\n      frontendId\n      submissionComment {\n        comment\n        flagType\n      }\n    }\n  }\n}\n    ",
        "variables": {
            "questionSlug": question_slug,
            "offset": 0,
            "limit": 20,
            "lastKey": None,
            "status": None
        },
        "operationName": "submissionList"
    }
    
    try:
        # 发送POST请求
        data = make_graphql_request(payload["query"], payload["variables"], payload["operationName"])
        
        # 检查响应结构
        if not data or 'data' not in data or 'submissionList' not in data['data']:
            print("无效的响应数据结构")
            return []
        
        submissions = data['data']['submissionList']['submissions']
        
        # 计算昨天的开始和结束时间戳
        date = datetime.datetime.strptime(date, '%Y-%m-%d').date()
        date_start = datetime.datetime.combine(date, datetime.time.min).timestamp()
        date_end = datetime.datetime.combine(date, datetime.time.max).timestamp()
        
        # 过滤出昨天的提交
        yesterday_submissions = []
        for submission in submissions:
            if 'timestamp' in submission:
                submission_time = int(submission['timestamp'])
                # 检查提交时间是否在昨天范围内
                if date_start <= submission_time < date_end and submission["submissionComment"]:
                    yesterday_submissions.append(submission)
        
        return yesterday_submissions
        
    except requests.exceptions.RequestException as e:
        print(f"请求出错: {e}")
        return []
    except Exception as e:
        print(f"处理响应出错: {e}")
        return []

# 获取题目详情
def get_question_detail(question_slug):
    query = """
          query questionDetail($titleSlug: String!) {
        languageList {
            id
            name
            verboseName
        }
        statusList {
            id
            name: translatedName
        }
        question(titleSlug: $titleSlug) {
            title
            titleSlug
            questionId
            questionFrontendId
            questionTitle
            translatedTitle
            content
            translatedContent
            categoryTitle
            difficulty
            stats
            style
            contributors {
                username
                profileUrl
                avatarUrl
            }
            book {
                id
                bookName
                pressName
                source
                shortDescription
                fullDescription
                bookImgUrl
                pressImgUrl
                productUrl
            }
            companyTagStatsV2
            topicTags {
                name
                slug
                translatedName
            }
            similarQuestions
            mysqlSchemas
            dataSchemas
            frontendPreviews
            likes
            dislikes
            isPaidOnly
            status
            boundTopicId
            enableTestMode
            metaData
            enableRunCode
            enableSubmit
            envInfo
            isLiked
            nextChallengePairs
            libraryUrl
            hints
            codeSnippets {
                code
                lang
                langSlug
            }
            jsonExampleTestcases
            exampleTestcases
            sampleTestCase
            hasFrontendPreview
            editorType
            featuredContests {
                titleSlug
                titleCn
                title
            }
        }
    }
        """
    operationName = "questionDetail"
    variables = {"titleSlug": question_slug}
    data = make_graphql_request(query, variables, operationName)
    return data.get("data", {}).get("question", {})

# 获取提交详情（包含完整代码）
def get_submission_detail(submission_id):
    query = """
          query submissionDetails($submissionId: ID!) {
        submissionDetail(submissionId: $submissionId) {
          code
          timestamp
          statusDisplay
          isMine
          runtimeDisplay: runtime
          memoryDisplay: memory
          memory: rawMemory
          lang
          langVerboseName
          question {
            questionId
            titleSlug
            hasFrontendPreview
          }
          user {
            realName
            userAvatar
            userSlug
          }
          runtimePercentile
          memoryPercentile
          submissionComment {
            flagType
          }
          passedTestCaseCnt
          totalTestCaseCnt
          fullCodeOutput
          testDescriptions
          testInfo
          testBodies
          stdOutput
          ... on GeneralSubmissionNode {
            outputDetail {
              codeOutput
              expectedOutput
              input
              compileError
              runtimeError
              lastTestcase
            }
          }
          ... on ContestSubmissionNode {
            outputDetail {
              codeOutput
              expectedOutput
              input
              compileError
              runtimeError
              lastTestcase
            }
          }
        }
      }
        """
    operationName = "submissionDetails"
    variables = {"submissionId": submission_id}
    data = make_graphql_request(query, variables, operationName)
    return data.get("data", {}).get("submissionDetail", {}).get("code", "")
  
def convert_html_to_markdown(html_content):
    # 转换标题
    markdown = re.sub(r'<h1>(.*?)</h1>', r'# \1', html_content)
    markdown = re.sub(r'<h2>(.*?)</h2>', r'## \1', markdown)
    markdown = re.sub(r'<h3>(.*?)</h3>', r'### \1', markdown)
    
    # 转换段落
    markdown = re.sub(r'<p>(.*?)</p>', r'\1\n\n', markdown)
    
    # 转换列表
    markdown = re.sub(r'<ul>(.*?)</ul>', lambda m: process_list(m.group(1), 'unordered'), markdown, flags=re.DOTALL)
    markdown = re.sub(r'<ol>(.*?)</ol>', lambda m: process_list(m.group(1), 'ordered'), markdown, flags=re.DOTALL)
    
    # 转换代码块
    markdown = re.sub(r'<pre>(.*?)</pre>', r'```\n\1\n```', markdown, flags=re.DOTALL)
    markdown = re.sub(r'<code>(.*?)</code>', r'`\1`', markdown)
    
    # 转换加粗
    markdown = re.sub(r'<strong>(.*?)</strong>', r'**\1**', markdown)
    markdown = re.sub(r'<b>(.*?)</b>', r'**\1**', markdown)
    
    # 转换斜体
    markdown = re.sub(r'<em>(.*?)</em>', r'*\1*', markdown)
    markdown = re.sub(r'<i>(.*?)</i>', r'*\1*', markdown)
    
    # 移除多余的空行
    markdown = re.sub(r'\n{3,}', '\n\n', markdown)
    
    return markdown.strip()

def process_list(list_content, list_type):
    items = re.findall(r'<li>(.*?)</li>', list_content, flags=re.DOTALL)
    result = []
    for i, item in enumerate(items):
        item_text = item.strip()
        if list_type == 'unordered':
            result.append(f'- {item_text}')
        else:
            result.append(f'{i+1}. {item_text}')
    return '\n'.join(result) + '\n'

# 生成Markdown文档
def generate_markdown(submissions, user_date):
    if not submissions:
        return "# 没有找到前一日的提交记录\n"
    
    yesterday = user_date if user_date else (datetime.datetime.now() - datetime.timedelta(days=1)).strftime('%Y-%m-%d')
    markdown_content = f"### {yesterday}\n\n"
    
    # 按题目分组提交
    for submission in submissions:
        title = submission["translatedTitle"]
        title_slug = submission["titleSlug"]
        submissionList = submission["submissionList"]
        question = submission["question"]
        questionFrontendId = submission["question"]["questionFrontendId"]
        
        question_url = f"https://leetcode.cn/problems/{title_slug}/description/"
        markdown_content += f"#### [{questionFrontendId}. {title}]({question_url})\n\n"
        markdown_content += f"{md(question['translatedContent'])}\n\n"
        # markdown_content += f"{convert_html_to_markdown(question['translatedContent'])}\n\n"
        
        # 处理每个提交
        for i, submission in enumerate(submissionList, 1):
            timestamp = datetime.datetime.fromtimestamp(int(submission["timestamp"])).strftime('%H:%M:%S')
            language = submission["lang"]
            code = submission.get("code", "")
            
            # 确定代码块语言标记
            lang_tag = language.lower()
            if lang_tag == "javascript":
                lang_tag = "js"
            elif lang_tag == "c++":
                lang_tag = "cpp"
            
            markdown_content += f"##### {submission.get('submissionComment', {}).get('comment', '题解')}\n\n"
            markdown_content += f"```{lang_tag}\n{code}\n```\n\n"

    return markdown_content


def get_user_date():
    while True:
        try:
            # 获取用户输入的日期字符串
            date_str = input("请输入日期（格式：YYYY-MM-DD，多个日期用逗号分隔）: ")
            if date_str.strip() == "":
                # 如果用户没有输入，默认使用昨天的日期
                yesterday = (datetime.datetime.now() - datetime.timedelta(days=1)).strftime('%Y-%m-%d')
                return [yesterday]
            
            # 分割多个日期
            dates = date_str.split(',')
            formatted_dates = []
            
            for date in dates:
                # 去除空格并解析日期字符串为 datetime.date 对象
                date = date.strip()
                formatted_date = datetime.datetime.strptime(date, '%Y-%m-%d').date().strftime('%Y-%m-%d')
                formatted_dates.append(formatted_date)
            
            return formatted_dates
        except ValueError:
            print("日期格式错误，请使用YYYY-MM-DD格式重新输入！")

# 主函数
def main():
    print("欢迎使用LeetCode提交记录收集工具！")
    csrf_token = "bsEtupJkWLs0wsOLwZbiHpeeBf3Vg6KU2erUHiYvVLQkMbhV3FFvZG6FrXBrVR4D"
    session_id = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfYXV0aF91c2VyX2lkIjoiNDA1MzY0NCIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNjVmMmYxM2ZkZTI5ZGE1ZGYwOWI2M2JlODBhYjZkYjI2ZjhjMzUzMWNmNDllNGQ0Yjc1YzNkNDA0YWQ3ODQwYiIsImlkIjo0MDUzNjQ0LCJlbWFpbCI6IjExNDU5ODY4ODlAcXEuY29tIiwidXNlcm5hbWUiOiJ0aWFuemhlbmd4dWFueWkiLCJ1c2VyX3NsdWciOiJ0aWFuemhlbmd4dWFueWkiLCJhdmF0YXIiOiJodHRwczovL2Fzc2V0cy5sZWV0Y29kZS5jbi9hbGl5dW4tbGMtdXBsb2FkL3VzZXJzL3RpYW56aGVuZ3h1YW55aS9hdmF0YXJfMTYzNzQxNDk1MS5wbmciLCJwaG9uZV92ZXJpZmllZCI6dHJ1ZSwiZGV2aWNlX2lkIjoiZTc4NGRlZGQxMGI3YjgxMWI0YzczYWJlZTc4MzZkNjIiLCJpcCI6IjE4MC4xMDIuMTU2LjE3MCIsIl90aW1lc3RhbXAiOjE3NTk4MDA0MjAuNDYxNzAzLCJleHBpcmVkX3RpbWVfIjoxNzYyMzY5MjAwLCJ2ZXJzaW9uX2tleV8iOjF9.IRaOqIo2SAslDpQ2uGRTEMzsjAqT6036nSyfcaaHIgs"
    
    # 调用函数获取用户输入的日期列表
    user_dates = get_user_date()
    
    # 对每个日期进行处理
    for user_date in user_dates:
        print(f"正在获取{user_date}的提交记录...")
        submissions = get_leetcode_submissions(csrf_token, session_id, user_date)
        
        if not submissions:
            print(f"{user_date}没有找到提交记录")
            continue
        
        # 生成Markdown文档
        markdown_content = generate_markdown(submissions, user_date)
        
        # 保存到文件
        filename = f"./algorithm/每日提交/leetcode_submissions_{user_date}.md"
        with open(filename, "w", encoding="utf-8") as f:
            f.write(markdown_content)
        
        print(f"{user_date}的Markdown文档已保存到：{os.path.abspath(filename)}")

if __name__ == "__main__":
    main()