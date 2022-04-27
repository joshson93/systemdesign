const { client } = require('../server/postgres');

//establishes connectiont to postgre
client.connect();

const getReviews = (id, callback) => {
  let data = { product: id.toString(), page: 0, count: 100, results: [] };
  let queryCommand =
    'select id as review_id, rating, response, body, date, summary, recommend, reviewer_name, helpfulness, photos FROM reviews WHERE product_id = $1';
  client.query(queryCommand, [id], (err, result) => {
    if (!err) {
      data.results = result.rows;
      callback(data);
    } else {
      console.log(err.message);
    }
  });
};

const getMetaData = (id, callback) => {
  let data = { product_id: id.toString() };
  let noData = { product_id: id.toString(), data: null };
  let queryCommand =
    'select recommend, characteristics_name, characteristics_value, characteristics_id, rating FROM reviews where product_id = $1';
  client.query(queryCommand, [id], (err, result) => {
    if (err) {
      console.log(err.message);
    } else {
      let array = result.rows;
      if (array.length === 0) {
        callback(noData);
        return;
      }
      let name = array[0].characteristics_name;
      if (!name) {
        console.log('Data with that product ID');
        callback(noData);
        return;
      }
      let characteristics = {};
      let char1Name;
      let char2Name;
      let char3Name;
      let char4Name;
      let characteristicNames = (str) => {
        let stringSplit = str.split('');
        stringSplit.pop();
        stringSplit.shift();
        let strArr = stringSplit.join('').split(',');
        char1Name = strArr[0] || null;
        char2Name = strArr[1] || null;
        char3Name = strArr[2] || null;
        char4Name = strArr[3] || null;
        characteristics[char1Name] = { id: null, value: null };
        characteristics[char2Name] = { id: null, value: null };
        characteristics[char3Name] = { id: null, value: null };
        characteristics[char4Name] = { id: null, value: null };
        for (let key in characteristics) {
          if (key === 'null') {
            delete characteristics[key];
          }
        }
        return characteristics;
      };
      characteristicNames(name);
      let recFalse = 0;
      let recTrue = 0;
      let one = 0;
      let two = 0;
      let three = 0;
      let four = 0;
      let five = 0;
      let char1Total = 0;
      let char2Total = 0;
      let char3Total = 0;
      let char4Total = 0;
      let char1Num = 0;
      let char2Num = 0;
      let char3Num = 0;
      let char4Num = 0;
      array.forEach((data) => {
        if (data.recommend === true) {
          recTrue++;
        } else {
          recFalse++;
        }
        if (data.rating === 1) {
          one++;
        }
        if (data.rating === 2) {
          two++;
        }
        if (data.rating === 3) {
          three++;
        }
        if (data.rating === 4) {
          four++;
        }
        if (data.rating === 5) {
          five++;
        }
        if (data.characteristics_value[0]) {
          char1Total += data.characteristics_value[0];
          characteristics[char1Name].id = data.characteristics_id[0];
          char1Num++;
        }
        if (data.characteristics_value[1]) {
          char2Total += data.characteristics_value[1];
          characteristics[char2Name].id = data.characteristics_id[1];
          char2Num++;
        }
        if (data.characteristics_value[2]) {
          char3Total += data.characteristics_value[2];
          characteristics[char3Name].id = data.characteristics_id[2];
          char3Num++;
        }
        if (data.characteristics_value[3]) {
          char4Total += data.characteristics_value[3];
          characteristics[char4Name].id = data.characteristics_id[3];
          char4Num++;
        }
      });
      data.recommended = { false: recFalse.toString(), true: recTrue.toString() };
      data.rating = {
        1: one.toString(),
        2: two.toString(),
        3: three.toString(),
        4: four.toString(),
        5: five.toString(),
      };
      characteristics[char1Name].value = String(char1Total / char1Num);
      if (characteristics[char2Name]) {
        characteristics[char2Name].value = String(char2Total / char2Num);
        characteristics[char3Name].value = String(char3Total / char3Num);
        characteristics[char4Name].value = String(char4Total / char4Num);
      }
      data.characteristics = characteristics;
      callback(data);
    }
  });
};

const postReview = (body, id) => {
  let bodyDate = Date.now();
  let charNames = '{Fit,Length,Quality,Comfort}';
  let queryCommand =
    'insert into reviews (product_id, date, characteristics_name, rating, summary, body, recommend, characteristics_id, characteristics_value, reviewer_name, reviewer_email, photos) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);';
  let columns = [
    id,
    bodyDate,
    charNames,
    body.rating,
    body.summary,
    body.body,
    body.recommend,
    Object.keys(body.characteristics),
    Object.values(body.characteristics),
    body.name,
    body.email,
    body.photos,
  ];
  client.query(queryCommand, columns, (err, result) => {
    if (!err) {
      console.log(result);
    } else {
      console.log(err.message);
    }
  });
};

const postHelpful = (id) => {
  let queryCommand = 'update reviews set helpfulness = helpfulness + 1 where id = $1';
  client.query(queryCommand, [id], (err, result) => {
    if (!err) {
      console.log(result);
    } else {
      console.log(err.message);
    }
  });
};

const postReport = (id) => {
  let queryCommand = 'update reviews set reported = NOT reported where id = $1';
  client.query(queryCommand, [id], (err, result) => {
    if (!err) {
      console.log(result);
    } else {
      console.log(err.message);
    }
  });
};

module.exports = { getReviews, getMetaData, postReview, postHelpful, postReport };
