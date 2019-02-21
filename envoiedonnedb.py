# -*- coding: utf-8 -*-
"""
Created on Sat Feb  9 19:11:22 2019

@author: Pret-UR
"""

import pymysql
ligne="ffffff"
conn = pymysql.connect(host="localhost",user="root" ,password="",db="my-python")
myCursor = conn.cursor();
myCursor.execute("INSERT INTO tag (id) VALUES  ('ligne');"
                 )
conn.commit()
conn.close()