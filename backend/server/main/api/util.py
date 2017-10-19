import json
import urllib.parse
import re


def status(code, info):
    # 构造错误返回体，code错误码，info错误消息
    return {'error': code, 'message': info}


def param(params):
    # 构造请求体
    return urllib.parse.urlencode(params).encode('utf-8')


def validBool(flag):
    # 有效bool验证
    if flag == 'true' or flag == 'false':
        return True
    return False


def log(msg):
    # 信息等级日志记录
    print(datetime.now().strftime('%Y-%m-%d %H:%M:%S') + ' [II] ' + msg)


def warn(msg):
    # 警告等级日志记录
    print(datetime.now().strftime('%Y-%m-%d %H:%M:%S') + ' [WW] ' + msg)


def err(msg):
    # 错误等级日志记录
    print(datetime.now().strftime('%Y-%m-%d %H:%M:%S') + ' [EE] ' + msg)
