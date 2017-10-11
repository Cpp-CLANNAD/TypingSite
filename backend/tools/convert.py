#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
from sys import argv
from pypinyin import pinyin as py
from pypinyin import Style as ST

config_path = '../../config.json'
keytab_path = '../../keymap.tab'

def printHelp():
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

    tone = [[lhTone[i][0], rhTone[i][0]] for i in range(len(article))]
    keys = []
    for i in range(len(article)):
        tmp = []
        if not lhTone[i][0] in keymap:
            tmp.append('')
        else:
            tmp.append(keymap[lhTone[i][0]])
        if not rhCh[i][0] in keymap:
            tmp.append('')
        else:
            tmp.append(keymap[rhCh[i][0]])
        if tmp[0] == '':
            if keymap['0'] == '1':
                tmp[0] = rhCh[i][0][0]
            elif keymap['0'] == '2':
                if len(rhCh[i][0]) == 2:
                    tmp = [rhCh[i][0][0], rhCh[i][0][1]]
                else:
                    tmp[0] = rhCh[i][0][0]
            else:
                tmp[0] = keymap['0']
        keys.append(tmp)

    rlt = [
        {
            'word': article[i],
            'desc': tone[i],
            'dmap': keys[i]
        } for i in range(len(article))
    ]
    print(rlt)

if __name__ == '__main__':
    if len(argv) <= 1:
        print('error')
        printHelp()
        exit(-1)

    if argv[1] == 'reverse':
        file = open(config_path, 'r', encoding='utf8')
        cfg = json.loads(file.read())['project']
        file.close()
        rlt = {}
        for project in cfg:
            rlt[project] = {}
            key_map = cfg[project]['key_map']
            for key in key_map:
                for ch in key_map[key]:
                    rlt[project][ch] = key
            rlt[project]['0'] = cfg[project]['0']
        file = open(keytab_path, 'w', encoding='utf8')
        file.write(json.dumps(rlt))
        file.write('\n')
        file.close()
        exit(0)
    elif argv[1] == 'help':
        printHelp()
        exit(0)

    project = 'weiruan'
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
    file = open(keytab_path, 'r', encoding='utf8')
    keymap = json.loads(file.read())
    file.close()
    if not project in keymap:
        print('error')
        exit(-1)

    genData(article, keymap[project])
    exit(0)
