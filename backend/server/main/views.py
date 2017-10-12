from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from tools import convert as pycv

# Create your views here.
def translateArticle(request):
    print(request.body.decode('utf8'))
    ret = pycv.articleToString(request.body.decode('utf8'), pycv.getKeymap(u'微软双拼'))
    return HttpResponse(ret, content_type='application/json', charset='utf-8')
