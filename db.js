const mysql = require("mysql");

const cn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root@",
  database: "contapp",
});
cn.on("error", (err) => {
  console.log(err);
});
async function list(data) {
  var result = await new Promise((resolve) => {
    var sql = `select * from ${tabla}`;
    if (data.condición) {
      sql = `${sql} where ${data.condición}`;
    }
    cn.query(sql, (err, rows) => {
      if (err) {
        resolve(err);
      } else {
        resolve(rows);
      }
    });
  });
  return result
}

async function save(data) {
  var campos = [],
    valores = [],
    camposYvalores = [];
  Object.keys(data.data).forEach((k) => {
    if (k.toLowerCase() != "id") {
      campos.push(`´${k}´`);
      valores.push(`'${data.data[k]}'`);
      camposYvalores.push(`´${k}´='${data.data[k]}'`);
    }
  });
  var sql = `insert into ${data.tabla}(${campos.join(
    ","
  )}) values(${valores.join(",")})`;
  if (data.data.id > 0) {
    sql = `update ${data.tabla} set ${camposYvalores} where id=${data.data.id}`;
  }
  var result = await new Promise((resolve) => {
    cn.query(sql, (err, ret) => {
      if (err) {
        resolve(err);
      } else {
        resolve(ret);
      }
    });
  });
  return result;
}

async function remove(data){
    var result = await new Promise(resolve=>{
        var sql = `delete from ${data.tabla} where ${data.condición}`
        cn.query(sql)
    })
    return result
}
module.exports = { list: list, save: save,delete:remove };
