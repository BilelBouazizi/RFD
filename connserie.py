
from serial import *
import serial
import pymysql
 
 
#conn = pymysql.connect(host="localhost",user="root" ,password="",db="my-python")
#myCursor = conn.cursor();
with serial.Serial(port="COM13", baudrate=9600, timeout=1, writeTimeout=1) as port_serie:
    
    if port_serie.isOpen():
        
      while True:
         ligne = port_serie.readline()
         tag=ligne[1:14]
         print (tag)
         if tag =="10-77-112-254":
             println ("le badge n'est pas inscris")
         if tag =="66-130-3-228-":
             conn = pymysql.connect(host="localhost",user="root" ,password="",db="my-python")
             myCursor = conn.cursor();
             myCursor.execute("INSERT INTO tag (id) VALUES ('66-130-3-228') " )
             conn.commit()
             conn.close()
         
         #myCursor.execute(""" INSERT INTO tag (id) VALUES ligne 
                # """)
         
#conn.commit()
#conn.close()
