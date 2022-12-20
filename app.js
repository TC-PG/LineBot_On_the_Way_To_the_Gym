'use strict';

require('dotenv').config();
const express = require('express'); 
const line = require('@line/bot-sdk');  
const crypto = require('crypto');
const ExerciseUtil = require("./util/exercise")
const app = express(); 

const config = {
    channelID: process.env.CHANNEL_ID, 
    channelSecret:process.env.CHANNEL_SECRET, 
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
};

const client = new line.Client(config);

//設定webhook路由
app.post('/webhook', line.middleware(config), (req, res) => {
    let signInKey = '';
    try {
      //產生對照組header
      signInKey = crypto.createHmac('sha256', process.env.CHANNEL_SECRET)
                        .update(Buffer.from(JSON.stringify(req.body)), 'utf8')
                        .digest('base64');
    } catch (e) {
      console.log(e);
    }

    //比對產生出的header是否與line官方的header相符，不符就回傳錯誤
    if(signInKey !== req.header('x-Line-Signature')){ 
      return res.send(error);
    }
//    console.log(req.body.events)
    Promise.all(req.body.events.map(handleEvent))
           .then((result) => {                
                return res.json(result)
            })
           .catch((err) => {
               console.error(err);
               res.status(500).end();
           });

});

async function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        // ignore non-text-message event
        return Promise.resolve(null);
    }
        
    const exerciesEnum = Object.freeze({
        "JUMP": 1,
        "BIKE": 2,
        "WEIGHTLIFTING": 3,
        "JOGGING": 4
    });
    
    const reply = {
        type: 'text',
        text: ''
    }

    const messages = event.message.text.split(" ");
    const exerciseType = messages[0];
    const duration = Math.round(parseFloat(messages[1]));
    
    
    if(!isValidInput(messages, exerciseType, duration)){
        reply.text = "格式錯誤，請重新輸入!";
        return client.replyMessage(event.replyToken, reply);
    }    
    
    /*
        呼叫python程式，帶入使用者輸入的運動類別以及運動時間
    */
    switch(exerciseType){
        case "跳躍":
            ExerciseUtil.execute(exerciesEnum.JUMP, duration)
                        .then(async () => {
                            await ExerciseUtil.sleep(duration);
                            reply.text = `您此次運動了${duration}分鐘! 請點此觀看您此次的運動數據: https://www.google.com.tw/?hl=zh_TW`;

                            console.log(exerciseType, exerciesEnum.JUMP, `運動${duration}分鐘`)
                            return client.replyMessage(event.replyToken, reply);
                        })
                        .catch((err) => {
                            console.log(`發生錯誤: ${err}`);
                            reply.text = "發生錯誤";
                            return client.replyMessage(event.replyToken, reply);
                        });            
            break;
        case "腳踏車":
            ExerciseUtil.execute(exerciesEnum.BIKE, duration)
                        .then(async () => {
                            await ExerciseUtil.sleep(duration);
                            reply.text = `您此次運動了${duration}分鐘! 請點此觀看您此次的運動數據: https://www.google.com.tw/?hl=zh_TW`;

                            console.log(exerciseType, exerciesEnum.BIKE, `運動${duration}分鐘`)
                            return client.replyMessage(event.replyToken, reply);
                        })
                        .catch((err) => {
                            console.log(`發生錯誤: ${err}`);
                            reply.text = "發生錯誤";
                            return client.replyMessage(event.replyToken, reply);
                        });
            break;
        case "健身":
            ExerciseUtil.execute(exerciesEnum.WEIGHTLIFTING, duration)
                        .then(async () => {
                            await ExerciseUtil.sleep(duration);
                            reply.text = `您此次運動了${duration}分鐘! 請點此觀看您此次的運動數據: https://www.google.com.tw/?hl=zh_TW`;

                            console.log(exerciseType, exerciesEnum.WEIGHTLIFTING, `運動${duration}分鐘`)
                            return client.replyMessage(event.replyToken, reply);
                        })
                        .catch((err) => {
                            console.log(`發生錯誤: ${err}`);
                            reply.text = "發生錯誤";
                            return client.replyMessage(event.replyToken, reply);
                        });
            break;
        case "跑步":
            ExerciseUtil.execute(exerciesEnum.JOGGING, duration)
                        .then(async () => {
                            await ExerciseUtil.sleep(duration);
                            reply.text = `您此次運動了${duration}分鐘! 請點此觀看您此次的運動數據: https://www.google.com.tw/?hl=zh_TW`;

                            console.log(exerciseType, exerciesEnum.JOGGING, `運動${duration}分鐘`)
                            return client.replyMessage(event.replyToken, reply);
                        })
                        .catch((err) => {
                            console.log(`發生錯誤: ${err}`);
                            reply.text = "發生錯誤";
                            return client.replyMessage(event.replyToken, reply);
                        });
            break;
        case "運動":
        case "使用方式":
            return;            
        default:
            reply.text = "格式錯誤，請重新輸入!";
            return client.replyMessage(event.replyToken, reply);            
    }
    
    
}

function isValidInput(messages, exerciseType, duration){    
    if(exerciseType === "運動" || exerciseType === "使用方式"){
        return true;
    }

    if(messages.length !== 2 || isNaN(duration)){                
        return false;
    }else{
        return true;
    }
    
}

app.listen(process.env.PORT || 3500, () => console.log(`The server has started on ${process.env.PORT || 3500}!`));