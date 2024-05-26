var express = require('express');
var router = express.Router();
var db = require('../lib/db');
const fs = require('fs');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const crypto = require('crypto');
const FileStore = require('session-file-store')(session); // 세션을 파일에 저장
const cookieParser = require('cookie-parser');

router.use(express.static(path.join(__dirname,'/public')));

router.use(express.urlencoded({
	exteneded: true
}));

router.use(session({
    secret: 'blackzat', // 데이터를 암호화 하기 위해 필요한 옵션
    resave: false, // 요청이 왔을때 세션을 수정하지 않더라도 다시 저장소에 저장되도록
    saveUninitialized: true, // 세션이 필요하면 세션을 실행시칸다(서버에 부담을 줄이기 위해)
    store : new FileStore() // 세션이 데이터를 저장하는 곳
}));

router.get('/login', (req, res)=>{
    res.render('board/login');
})

router.post('/login',(req,res)=>{
    var id = req.body.id;
    var pw = req.body.pw;
    db.query('select * from student where id=?',[id],(err,data)=>{
        // 로그인 확인
        console.log(data[0]);
        console.log(id);
        console.log(data[0].id);
        console.log(data[0].pw);
        console.log(id == data[0].id);
        console.log(pw == data[0].pw);
        if(id == data[0].id || pw == data[0].pw){
            console.log('로그인 성공');
            // 세션에 추가
            req.session.is_logined = true;
            req.session.name = data.name;
            req.session.id = data.id;
            req.session.pw = data.pw;
            req.session.save(function(){ // 세션 스토어에 적용하는 작업
                res.render('index',{ // 정보전달
                    name : data[0].name,
                    id : data[0].id,
                    age : data[0].age,
                    is_logined : true
                });
            });
        }else{
            console.log('로그인 실패');
            res.render('login');
        }
    });
})

router.get('/register', (req, res)=>{
    res.render('board/register');
})

router.post('/register',(req,res)=>{
    var id = req.body.id;
    var pw = req.body.pw;
    var name = req.body.name;
    var age = req.body.age;
    var major = req.body.major;
    var birth = req.body.birth;
    var data = [id,pw,name,age,major,birth];
    
    db.query('select * from student where id=?',[id],(err,result)=>{
        if(result.length == 0){
            console.log('회원가입 성공');
            db.query('insert into student(id, name, age, pw, major, birth) values(?,?,?,?,?,?)',[
                id, name, age, pw, major, birth
            ]);
            res.redirect('/');
        }else{
            console.log('회원가입 실패');
            res.send('<script>alert("회원가입 실패");</script>')
            res.redirect('/login');
        }
    });
});

module.exports = router;