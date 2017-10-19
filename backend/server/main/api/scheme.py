from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from tools import convert as pycv


def getList(request):
    return HttpResponse('WIP', charset='utf-8')


def getScheme(request, name=u'微软双拼'):
    return HttpResponse('WIP', charset='utf-8')


def addScheme(request):
    return HttpResponse('WIP', charset='utf-8')
