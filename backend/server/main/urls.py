"""xhServer URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from main.api import article, scheme

urlpatterns = [
    url(r'^article/list$', article.getList, name='article_list'),
    url(r'^article/(?P<id>\d{1,3})$', article.getArticle, name='article_get'),
    url(r'^article/convert/(?P<name>\w+)$', article.convertArticle, name='article_convert'),
    url(r'^article/convert/?$', article.convertArticle, name='article_convert'),

    url(r'^scheme/list$', scheme.getList, name='scheme_list'),
    url(r'^scheme/(?P<name>\w+)$', scheme.getScheme, name='scheme_get'),
    # url(r'^category/list$', category.list, name='category_list'),

    # url(r'^phone/sign$', phone.sign, name='phone_sign'),
    # url(r'^phone/login$', phone.login, name='phone_login'),
    # url(r'^phone/bind$', phone.bind, name='phone_bind'),

    # url(r'^oauth/tencent$', oauth.tencent, name='oauth_tencent'),
    # url(r'^oauth/wechat$', oauth.wechat, name='oauth_wechat'),
    # url(r'^oauth/weibo$', oauth.weibo, name='oauth_weibo'),

    # url(r'^oauth/tencent/bind$', oauth.bindTencent, name='oauth_tencent_bind'),
    # url(r'^oauth/wechat/bind$', oauth.bindWechat, name='oauth_wechat_bind'),
    # url(r'^oauth/weibo/bind$', oauth.bindWeibo, name='oauth_weibo_bind'),

    # url(r'^user/logout$', user.logout, name='user_logout'),
    # url(r'^user/info$', user.info, name='user_info'),
    # url(r'^user/set$', user.set, name='user_set'),

    # url(r'^subject/list$', subject.list, name='subject_list'),
    # url(r'^subject/collect$', subject.collect, name='subject_collect'),
    # url(r'^subject/hot$', subject.hot, name='subject_hot'),
    # url(r'^upload/token$', upload.token, name='upload_token'),
    # url(r'^upload/file$', upload.file, name='upload_file'),
]
