var express = require('express');
var router = express.Router();
var db = require('../lib/db');

// post
router.use(express.urlencoded({
	extened: true
}));

//fs
var fs = require('fs');

//multer
var multer = require('multer');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		var dirtemp = new Date();
		var path = 'upload/';
		var dir = path + dirtemp.getFullYear() + '' + (dirtemp.getMonth() + 1) + '' + dirtemp.getDate();
		!fs.existsSync(dir) && fs.mkdirSync(dir);
		cb(null, dir);
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '_' + file.originalname);
	}
})
const upload = multer({
	storage: storage
})

router.get('/board', function (req, res) {
	var sql = "select * from board";
	db.query(sql, function (err, rows) {
		res.render('board', {
			rows: rows
		});
	});
});

router.get('/board/write', function (req, res) {
	res.render('board/write');
});

router.post('/board/write', upload.single('file'), function (req, res) {
	var writer = req.body.writer;
	var password = req.body.password;
	var title = req.body.title;
	var content = req.body.content;
	if (req.file) {
		var o_name = req.file.originalname;
		var c_name = req.file.filename;
		var path = '/' + req.file.destination + '/';
		var size = req.file.size;
		var data = [writer, password, title, content, o_name, c_name, path, size];
		var sql = "insert into board(idx, writer, password, title, content, date, del_yn, file_o_name, file_c_name, file_path, file_size) values(null,?,?,?,?,now(),'N',?,?,?,?)";
		db.query(sql, data);
	}
	else{
	var data = [writer, password, title, content];
	var sql = "insert into board(idx, writer, password, title, content, date, del_yn, file_o_name, file_c_name, file_path, file_size) values(null,?,?,?,?,now(),'N',null,null,null,null)";
	db.query(sql, data);
	}
	res.redirect('/board');
});

router.get('/board/view/:idx', function (req, res) {
	var idx = req.params.idx;
	var sql = "select * from board where 1=1 and idx=?";
	db.query(sql, [idx], function (err, rows) {
		res.render('board/view', {
			result: rows[0]
		});
	});
});

router.get('/board/:type/:idx', function (req, res) {
	var type = req.params.type;
	var idx = req.params.idx;
	if (type == "modify") {
		var title = "수정";
	}
	if (type == "delete") {
		var title = "삭제";
	}
	res.render('board/auth', {
		idx: idx,
		type: type,
		title: title
	});
});

router.post('/board/:type/:idx', function (req, res) {
	var type = req.params.type;
	var idx = req.params.idx;
	var password = req.body.password;
	var sql = "select password from board where 1=1 and idx=?";
	db.query(sql, [idx], function (err, rows) {
		var temp = rows[0].password;
		if (temp != password) {
			res.render('board/error');
		} else {
			if (type == "modify") {
				var sql = "select * from board where 1=1 and idx=?";
				db.query(sql, [idx], function (err, rows) {
					res.render('board/modify', {
						head: "글 수정하기",
						idx: idx,
						writer: rows[0].writer,
						title: rows[0].title,
						content: rows[0].content
					});
				});
			}
			if (type == "delete") {
				var sql = "update board set del_yn='Y' where 1=1 and idx=?";
				db.query(sql, idx);
				res.redirect('/board');
			}
		}
	});
});

router.post('/board/modify/:idx/ok', function (req, res) {
	var idx = req.params.idx;
	var writer = req.body.writer;
	var password = req.body.password;
	var title = req.body.title;
	var content = req.body.content;
	var data = [writer, password, title, content, idx];
	var sql = "update board set writer=?,password=?,title=?,content=?,date=now() where 1=1 and idx=?";
	db.query(sql, data);
	res.redirect('/board/view/' + idx);
});

router.get('/:path/:dir/:c_name', function (req, res) {
	var url = req.params.path + '/' + req.params.dir + '/' + req.params.c_name;
	res.download(url, req.params.c_name);
});

module.exports = router;
