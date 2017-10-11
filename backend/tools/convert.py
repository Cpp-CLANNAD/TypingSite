import json
from sys import argv
from pypinyin import pinyin as py
from pypinyin import Style as ST

if __name__ == '__main__':
    project = '微软'

    file = open('str2key.js', 'r', encoding='utf8')
    keyMap = json.loads(file.read())
    file.close()

    file = open(argv[1], 'r', encoding='utf8')
    article = file.read()
    file.close()
    lhTone = py(article, style = ST.INITIALS)
    rhTone = py(article, style = ST.FINALS_TONE)
    rhCh = py(article, style = ST.FINALS)
    print(lhTone)
    print(rhTone)
    print(rhCh)
    tone = [ [lhTone[i][0], rhTone[i][0]] for i in range(len(article)) ]
    keys = []
    for i in range(len(article)):
        tmp = []
        if not lhTone[i][0] in keyMap[project]:
            tmp.append('')
        else:
            tmp.append(keyMap[project][lhTone[i][0]])
        if not rhCh[i][0] in keyMap[project]:
            tmp.append('')
        else:
            tmp.append(keyMap[project][rhCh[i][0]])
        keys.append(tmp)
    
    rlt = [
        {
            'word': article[i],
            'desc': tone[i],
            'dmap': keys[i]
        } for i in range(len(article))
    ]
    print(rlt)
    

    # file = open('config.json', 'r', encoding='utf8')
    # ctx = file.read()
    # file.close()
    # cfg = json.loads(ctx)
    # rlt = {}
    # for project in cfg:
        # rlt[project] = {}
        # key_map = cfg[project]['key_map']
        # for key in key_map:
            # for ch in key_map[key]:
                # rlt[project][ch] = key
    # ctx = json.dumps(rlt)
    # file = open('str2key.js', 'w', encoding='utf8')
    # file.write(ctx)
    # file.write('\n')
    # file.close()