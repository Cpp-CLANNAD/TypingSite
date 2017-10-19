from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from tools import convert as pycv


def getList(request):
    return HttpResponse('WIP', charset='utf-8')


def getArticle(request, id=u'000'):
    return HttpResponse('WIP', charset='utf-8')


def convertArticle(request, name=u'微软双拼'):
    print(request.body.decode('utf8'))
    ret = pycv.articleToString(request.body.decode('utf8'), pycv.getKeymap(name))
    return HttpResponse(ret, content_type='application/json', charset='utf-8')


def addScheme(request):
    return HttpResponse('WIP', charset='utf-8')
