const oracledb = require('oracledb');

const dbconnecta =async(sql,binds,autoCommit)=> {
  const cns = {user:process.env.USER, password:process.env.PASSWORD,connectString:process.env.CONNECT_STRING};
  
  const cnn = await oracledb.getConnection(cns);
  const result = await cnn.execute(sql,binds,{autoCommit})
  await cnn.close();

  return result;
}
const dbSeguridad =async(sql,binds,autoCommit)=> {
  const cns = {user:process.env.USERSEG, password:process.env.PASSWORDSEG,connectString:process.env.CONNECT_STRING};
  
  const cnn = await oracledb.getConnection(cns);
  const result = await cnn.execute(sql,binds,{autoCommit})
  await cnn.close();

  return result;
}

module.exports={
  dbconnecta,
  dbSeguridad
};