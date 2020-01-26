// model of DB object:
// qID, questionText, correctAnswer, studentAnswer, result

if (!window.indexedDB) {
  	alert("Sorry.  This browser does not support IndexedDB.");
}

let db,
	tx,
	store,
	index;

// open DB
let request = window.indexedDB.open("QuizQuestionDatabase", 1);

// if first time accessing db or a new version
request.onupgradeneeded = function(e) {
	let db = request.result;
	let store = db.createObjectStore("QuestionsStore", {
			keyPath: "qID"  // will use id from db obj
		});
		// store = db.createObjectStore("QuestionStore", {
		// 	autoIncrement: true  // could auto increment if db obj had no unique identifier
		// });
	let index = store.createIndex("question", "questionText", {unique: false});  // index name , obj key, key always unique?
}

request.onerror = function(e) {
	console.log("There was an error: ", e.target.errorCode);
};

request.onsuccess = function(event) {  // could use the event obj for this also
	db = request.result;  // result of opening DB
	tx = db.transaction("QuestionsStore", "readwrite");
	store = tx.objectStore("QuestionsStore");
	index = store.index("question");

	db.onerror = function(e) {
		console.log("ERROR: ", e.target.errorCode);
	}

	// store data
	store.put({qID: 1, questionText: "The sky is blue.", correctAnswer: true, studenAnswer: true, result: true});
	store.put({qID: 2, questionText: "The grass is green.", correctAnswer: true, studenAnswer: true, result: true});

	// retrieve data
	let q1 = store.get(1);  // getting data via key rather than via index
	let qs = index.get("The grass is green.");  // getting data via index created in during onsuccess()

	q1.onsuccess = function() {
		console.log("q1 record: ", q1.result);  // returned record
		console.log("q1 question: ", q1.result.questionText);
	};

	qs.onsuccess = function() {
		console.log("qs record: ", qs.result);
		console.log("qs question: ", qs.result.questionText);
	};

	// close db
	tx.oncomplete = function() {
		db.close();
	};
}
