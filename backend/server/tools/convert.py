#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json, re
from sys import argv
from pypinyin import pinyin as py
from pypinyin import lazy_pinyin as lapy
from pypinyin import Style as ST

class TableConfig:
    def reset(self):
        self.config_path = '../../config.json'
        self.keytab_path = '../../keymap.json'
        self.strtab_path = '../../strmap.json'

    def __init__(self):
        self.reset()

    def setConfig(self, filename):
        self.config_path = filename

    def setKeytab(self, filename):
        self.keytab_path = filename

    def setStrtab(self, filename):
        self.strtab_path = filename

    def getConfig(self):
        return self.config_path

    def getKeytab(self):
        return self.keytab_path

    def getStrtab(self):
        return self.strtab_path


config = TableConfig()

def getKeymap(project):
    file = open(config.getStrtab(), 'r', encoding='utf8')
    keymap = json.loads(file.read())
    file.close()
    if project in keymap:
        return keymap[project]
    else:
        return None

def printHelp():
    print('')
    print('convert.py reverse')
    print('\tgenerate reverse key map file\n')
    print('convert.py gen <filename> [<project_name>]')
    print('\tgenerate data from article with project, default project is Microsoft\n')
    print('convert.py genb <string> <project_name>')
    print('\tgenerate data from string with project, default project is Microsoft\n')


def parseOtherStr(str):
    return [ch for ch in str]


def articleToObject(article, keymap):
    lhTone = py(article, style=ST.INITIALS, errors=parseOtherStr)
    rhTone = py(article, style=ST.FINALS_TONE, errors=parseOtherStr)
    rhCh = py(article, style=ST.FINALS, errors=parseOtherStr)

    # tone = [[lhTone[i][0], rhTone[i][0]] for i in range(len(article))]
    tone = []
    for i in range(len(lhTone)):
        tmp = []
        if lhTone[i][0] != '':
            for x in lhTone[i]:
                tmp.append(x)
        if rhTone[i][0] != '':
            for x in rhTone[i]:
                tmp.append(x)
        tone.append(tmp)
    keys = []
    for i in range(len(lhTone)):
        tmp = []
        if not lhTone[i][0] in keymap:
            pass
        else:
            # tmp.append(keymap[lhTone[i][0]])  # dmap按键方案
            tmp.append(lhTone[i][0])    # dmap声韵母方案
        if not rhCh[i][0] in keymap:
            pass
        else:
            # tmp.append(keymap[rhCh[i][0]])    # dmap按键方案
            tmp.append(rhCh[i][0])  # dmap声韵母方案
        # if len(tmp) == 1:    # 单韵母情况
        # if tmp[0] == '':    # 单韵母情况
        #     if keymap['0'] == '1':  # 非固定零声母统一方案
        #         tmp[0] = rhCh[i][0][0]
        #     elif keymap['0'] == '2':    # 非固定零声母二字母全拼方案
        #         if len(rhCh[i][0]) == 2:
        #             tmp = [rhCh[i][0][0], rhCh[i][0][1]]
        #         else:
        #             tmp[0] = rhCh[i][0][0]
        #     else:           # 固定零声母方案，keymap['0']表示零声母键
        #         tmp[0] = keymap['0']
        keys.append(tmp)

    # 非汉字desc/dmap置空项
    # rlt = [
    #     {
    #         'word': article[i],
    #         'desc': tone[i],
    #         'dmap': keys[i]
    #     } for i in range(len(article))
    # ]
    # 非汉字desc/dmap删除项目
    whiteChar = re.compile('^ $|^\n$|^　$|^\t$')
    ret = { 'article': [] }
    rlt = ret['article']
    iWord = 0
    for iKey in range(len(tone)):
        tmp = { 'word': article[iWord] }
        if tone[iKey][0] != article[iWord][0]:
            tmp['desc'] = tone[iKey]
            tmp['dmap'] = keys[iKey]
            rlt.append(tmp)
            iWord += 1
        else:
            for iIdx in range(int(len(tone[iKey]) / 2)):
                tmp = { 'word': tone[iKey][iIdx] }
                if whiteChar.match(tmp) != None:
                    continue
                rlt.append(tmp)
                iWord += 1
    return ret
    # json.dumps(rlt, ensure_ascii=False)

def articleToString(article, keymap):
    return json.dumps(articleToObject(article, keymap), ensure_ascii=False)

def genFrontendTab(filename):
    initials_tab = ['b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'z', 'c', 's', 'r', 'zh', 'ch', 'sh', 'y', 'w']
    file = open(filename, 'r', encoding='utf8')
    otab = json.loads(file.read())
    file.close()
    cfg = otab
    key_tab = {}
    str_tab = {}
    for project in cfg:
        key_tab[project] = {'key_map': {}}
        str_tab[project] = {}
        keymap = cfg[project]['keymap']
        for key in keymap:
            key_tab[project]['key_map'][key] = [None, []]
            for ch in keymap[key]:
                if ch in initials_tab:
                    key_tab[project]['key_map'][key][0] = ch
                else:
                    key_tab[project]['key_map'][key][1].append(ch)
                str_tab[project][ch] = key
        key_tab[project]['0'] = cfg[project]['0']
    file = open(config.getKeytab(), 'w', encoding='utf8')
    file.write(json.dumps(key_tab, ensure_ascii=False))
    file.write('\n')
    file.close()
    file = open(config.getStrtab(), 'w', encoding='utf8')
    file.write(json.dumps(str_tab, ensure_ascii=False))
    file.write('\n')
    file.close()

if __name__ == '__main__':
    if len(argv) <= 1:
        print('error')
        printHelp()
        exit(-1)

    if argv[1] == 'reverse':
        genFrontendTab(config.getConfig())
        exit(0)
    elif argv[1] == 'help':
        printHelp()
        exit(0)

    project = u'微软双拼'
    article = ''
    if argv[1] == 'gen':
        if len(argv) < 3:
            print('error')
            exit(-1)
        file = open(argv[2], 'r', encoding='utf8')
        article = file.read()
        file.close()
    elif argv[1] == 'genb':
        if len(argv) < 3:
            print('error')
            exit(-1)
        article = argv[2]
    else:
        print('error')
        printHelp()
        exit(-1)

    if len(argv) >= 4:
        project = argv[3]
    keymap = getKeymap(project)
    if keymap == None:
        print('error')
        exit(-1)

    print(articleToString(article, keymap))
    exit(0)
