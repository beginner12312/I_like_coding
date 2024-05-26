var express = require('express');
var router = express.Router();
var db = require('../lib/db');

router.use(express.urlencoded({
	extended: true
}));

router.get('/board/write', function (req, res) {
	res.render('board/write');
});

router.post('/board/write', function (req, res) {
	var writer = req.body.writer;
	var password = req.body.password;
	var title = req.body.title;
	var content = req.body.content;
	var data = [writer, password, title, content];
	var sql = "insert into board(idx, writer, password, title, content, date, del_yn) values(null,?,?,?,?,now(),'N')";
	db.query(sql, data);
	res.redirect('/board');
});

router.post('/board/modify/:idx/ok', function (req, res) {
	var idx =req.params.idx;
	var writer = req.body.writer;
	var password = req.body.password;
	var title = req.body.title;
	var content = req.body.content;

	var data = [writer, password, title, content,idx];
	var sql = "UPDATE board SET writer = ?, password = ?, title = ?, content = ? WHERE idx = ?";
	db.query(sql, data);
	res.redirect('/board/view/'+idx);
});

router.get('/board', function (req, res) {
	var sql = "select * from board";
	db.query(sql, function (err, rows) {
		res.render('board', {
			rows: rows
		});
	});
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
				var sql = "DELETE FROM board WHERE 1=1 and idx = ?;";
				db.query(sql, idx);
				res.redirect('/board');
			}
		}
	});
});


module.exports = router;