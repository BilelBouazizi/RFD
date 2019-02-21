//AHA
#include <SPI.h>
#include <Wire.h> 
#include <LiquidCrystal_I2C.h>
#include <MFRC522.h>
#include <Servo.h>
#define SS_PIN 10
#define RST_PIN 8
MFRC522 mfrc522(SS_PIN, RST_PIN);
LiquidCrystal_I2C lcd(0x27, 16, 2);
byte card_ID[4];
byte data ;
byte First_card_ID[4]={0xA6,0x82,0x3,0xE4};
  byte ch ;
  byte s[40];
  int c=0 ;
boolean State=false;
int RedLed=6;
int GreenLed=5;
int Buzzer=7;
String s1;
Servo myservo; 
void setup() {
    lcd.begin();

  // Turn on the blacklight and print a message.
  lcd.backlight();
  Serial.begin(9600); 
 SPI.begin();  
 mfrc522.PCD_Init(); 

for(int def=5;def<8;def++){
 pinMode(def,OUTPUT); 
   myservo.attach(3);
   myservo.write(90);
}

}

void cmp_id(){
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    if(card_ID[i]==First_card_ID[i]){
     State=true; 
  }
  else{
     State=false; 
     i=5;
  }
  }
}
void sendTag() {
 for (byte i = 0; i < 4; i++) {
     if(card_ID[i]<15) Serial.print(0,HEX);
     Serial.print(card_ID[i],HEX);
     if(i < 3)   
     Serial.print("-");
}
Serial.println();
}

void readTag(){

     if ( ! mfrc522.PICC_IsNewCardPresent()) {
  return;
  
  }

 if ( ! mfrc522.PICC_ReadCardSerial()) {
  return;
 }
 
 digitalWrite(Buzzer,HIGH);
 for (byte i = 0; i < mfrc522.uid.size; i++) {
     card_ID[i]=mfrc522.uid.uidByte[i];
}
delay(500);
digitalWrite(Buzzer,LOW);
delay(500);

}
  


void loop() {
  if(Serial.available()>0) {
  data=Serial.read() ;
 


if(data==';') {digitalWrite(GreenLed,HIGH); myservo.write(180);


while (data!='|' && data!='=') {
  data=Serial.read() ;
  }
  if(data=='|') {
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Bienvenue");
  ch=' ';
  lcd.setCursor(0,1);
  while(ch!='\n') {
     while(!Serial.available()>0) ;
     ch=Serial.read() ;
    if(ch !='\n')
    lcd.write(ch);
  }
}
else if (data=='=') {

  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Au Revoir !");
  ch=' ';
  lcd.setCursor(0,1);
  while(ch!='\n') {
     while(!Serial.available()>0) ;
     ch=Serial.read() ;
    if(ch !='\n')
    lcd.write(ch);
  }
}
}
else if(data==',') {
    lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("ACCES REFUSEE");
                    digitalWrite(RedLed,HIGH);digitalWrite(Buzzer,HIGH);
                    delay(500);
                    digitalWrite(RedLed,LOW);digitalWrite(Buzzer,LOW);
                    delay(500);
                    digitalWrite(RedLed,HIGH);
                    digitalWrite(Buzzer,HIGH);
                    delay(500);
                                        digitalWrite(Buzzer,LOW);

                    }

delay(2000) ;
lcd.clear();
digitalWrite(GreenLed,LOW);
digitalWrite(RedLed,LOW);
myservo.write(90);

}

readTag() ;

delay(100);
if(card_ID[0]!=0) {
sendTag();
card_ID[0]=0 ;
}

delay(100);
}
