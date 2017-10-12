#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
from sys import argv
from pypinyin import pinyin as py
from pypinyin import Style as ST

config_path = '../../config.json'
keytab_path = '../../keymap.js'
strtab_path = '../../strmap.js'

def printHelp():
    print('')
    print('convert.py reverse')
    print('\tgenerate reverse key map file\n')
    print('convert.py gen <filename> [<project_name>]')
    print('\tgenerate data from article with project, default project is Microsoft\n')
    print('convert.py genb <string> <project_name>')
    print('\tgenerate data from string with project, default project is Microsoft\n')

def genData(data, keymap):
    lhTone = py(article, style=ST.INITIALS)
    rhTone = py(article, style=ST.FINALS_TONE)
    rhCh = py(article, style=ST.FINALS)

    # tone = [[lhTone[i][0], rhTone[i][0]] for i in range(len(article))]
    tone = []
    for i in range(len(article)):
        tmp = []
        if lhTone[i][0] != '':
            tmp.append(lhTone[i][0])
        if rhTone[i][0] != '':
            tmp.append(rhTone[i][0])
        tone.append(tmp)
    keys = []
    for i in range(len(article)):
        tmp = []
        if not lhTone[i][0] in keymap:
            pass #tmp.append('')
        else:
            # tmp.append(keymap[lhTone[i][0]])  # dmap按键方案
            tmp.append(lhTone[i][0])    # dmap声韵母方案
        if not rhCh[i][0] in keymap:
            pass #tmp.append('')
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
    rlt = []
    for i in range(len(article)):
        tmp = { 'word': article[i] }
        if tone[i][0] != article[i]:
            tmp['desc'] = tone[i]
            tmp['dmap'] = keys[i]
        rlt.append(tmp)
    print(rlt)

def genFrontendTab(filename):
    initials_tab = ['b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'z', 'c', 's', 'r', 'zh', 'ch', 'sh', 'y', 'w']
    file = open(filename, 'r', encoding='utf8')
    otab = json.loads(file.read())
    file.close()
    cfg = otab
    key_tab = {}
    str_tab = {}
    for project in cfg:
        key_tab[project] = {}
        str_tab[project] = {}
        keymap = cfg[project]['keymap']
        for key in keymap:
            key_tab[project][key] = [None, []]
            for ch in keymap[key]:
                if ch in initials_tab:
                    key_tab[project][key][0] = ch
                else:
                    key_tab[project][key][1].append(ch)
                str_tab[project][ch] = key
        key_tab[project]['0'] = cfg[project]['0']
    file = open(keytab_path, 'w', encoding='utf8')
    file.write(json.dumps(key_tab))
    file.write('\n')
    file.close()
    file = open(strtab_path, 'w', encoding='utf8')
    file.write(json.dumps(str_tab))
    file.write('\n')
    file.close()

if __name__ == '__main__':
    if len(argv) <= 1:
        print('error')
        printHelp()
        exit(-1)

    if argv[1] == 'reverse':
        genFrontendTab(config_path)
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
    file = open(strtab_path, 'r', encoding='utf8')
    keymap = json.loads(file.read())
    file.close()
    if not project in keymap:
        print('error')
        exit(-1)

    genData(article, keymap[project])
    exit(0)
