const mysql = require("mysql");

const cn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "cc123456",
  database: "contapp",
});
cn.on("error",(err)=>{console.log(err)})
function list(data,resolve) {

  var sql = `select * from ${data.tabla}`;
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

}

function save(data,resolve) {
  var campos = [],
    valores = [],
    camposYvalores = [];
  Object.keys(data.data).forEach((k) => {
    if (k.toLowerCase() != "id" && k.toLowerCase() != "children") {
      campos.push(`\`${k}\``);
      valores.push(`'${data.data[k]}'`);
      camposYvalores.push(`\`${k}\`='${data.data[k]}'`);
    }
  });
  var sql = `insert into \`${data.table}\` (${campos.join(
    ","
  )}) values(${valores.join(",")})`;
  if (data.data.id > 0) {
    sql = `update \`${data.table}\` set ${camposYvalores} where \`id\`=${data.data.id}`;
  }
  cn.query(sql, (err, rows) => {
    if (err) {
      resolve(err);
    } else {
      if(data.data.children){
        cn.query(`delete from \`${data.data.children.table}\` where \`${data.data.children.parentId}\`=${rows.insertId}`,()=>{
          data.data.children.data.forEach(child=>{
            child[data.data.children.parentId]=rows.insertId
            save({table:data.data.children.table,data:child},(x)=>{console.log(x)})
          })
        })
      }
      resolve(rows);
    }
  });
}

function remove(data,resolve){
  var sql = `delete from ${data.tabla} where ${data.condición}`
  cn.query(sql,(err,rows)=>{
    if(err){resolve(err)}
    else{resolve(rows)}
  })

}
module.exports = {list, save,delete:remove };
