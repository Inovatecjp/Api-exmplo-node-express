const sequelize = require("./connection");
const Sequelize = require("sequelize");
const User = require("../apps/Autenticacao/models/User");
const Grant = require("../apps/Autenticacao/models/grant");
const Profile = require("../apps/Autenticacao/models/profile");
const ProfileGrant = require("../apps/Autenticacao/models/profileGrant");






const Op = Sequelize.Op;

/** Associations */

Profile.belongsToMany(Grant, { through: ProfileGrant, as: "grants" });
Grant.belongsToMany(Profile, { through: ProfileGrant, as: "profiles" });
ProfileGrant.belongsTo(Profile);
ProfileGrant.belongsTo(Grant);

User.belongsTo(Profile, { as: "profilesId", foreignKey: "profiles_id" });




const db = {};

const MAX_PAGE_NUMBER = 500;

const isDate = (str) => {
  try {
    new Date(str);
    return true;
  } catch (error) {
    return false;
  }
};

function renameKeys(obj, newKeys) {
  const keyValues = Object.keys(obj).map(key => {
    const newKey = newKeys[key] || key;
    return { [newKey]: obj[key] };
  });
  return Object.assign({}, ...keyValues);
}

const paginate = (req, options = {}) => {
  const page = req.query.page || 0;
  let pageSize = req.query.pageSize || 5;
  if (Number(pageSize) === -1) {
    pageSize = MAX_PAGE_NUMBER;
  }
  const offset = page * pageSize;
  const limit = pageSize;

  let result = {};
  Object.keys(options).forEach(function (option) {
    if (option !== "filter") {
      result[option] = options[option];
    }
  });
  result["limit"] = parseInt(limit);
  result["offset"] = parseInt(offset);

  const reqFilters = req.query.filter;

  let filterStr = {};
  //console.log('0====>');
  //console.log(req.userInfo);
  //console.log(req.userInfo.filterableRoute);
  //console.log(req.userInfo.profile);
  //console.log(req.userInfo.path);


  
  if (reqFilters && reqFilters.length > 0) {
    let filters = reqFilters;
    if (filters.startsWith("[[")) {
      filters = reqFilters.substring(1, reqFilters.length - 1); // remove o [] do início e fim da string
    }
    filters = filters.split(",and,"); // extraindo os filtros em arrays

    var cast = [];

    filters.forEach((filter) => {
      const filterTokens = filter.substring(1, filter.length - 1).split(",");

      if (filterTokens && filterTokens.length > 0) {
        if (filterTokens[1] === "between") {
          let from = filterTokens[2];
          let to = filterTokens[3];
          if (isDate(filterTokens[2])) {
            from = `${filterTokens[2]} 00:00:00.000`;
            to = `${filterTokens[3]} 23:59:59.999`;
          }
          filterStr[filterTokens[0]] = {
            [Op.between]: [new Date(from), new Date(to)],
          };
        } else if (filterTokens[1] === "equals") {
          filterStr[filterTokens[0]] = { [Op.eq]: filterTokens[2] };
        } else if (filterTokens[1] === "in") {
          let values = [];
          for (let i = 2; i < filterTokens.length; i++) {
            values.push(filterTokens[i]);
          }
          filterStr[filterTokens[0]] = { [Op.in]: values };
        } else if (["date", "number"].indexOf(filterTokens[1]) !== -1) {
          filterStr[filterTokens[0]] = 
            sequelize.where(
              sequelize.cast(sequelize.col(filterTokens[0]), 'varchar'),
              {[Op.iLike]: `%${filterTokens[2].replace('T', ' ')}%`}
            )
        } else {
          filterStr[filterTokens[0]] = { [Op.iLike]: `%${filterTokens[2]}%` };

          // let strField = filterTokens[0].replace(/[$]/g, '')
          // cast.push(sequelize.where(sequelize.cast(sequelize.col(strField), 'varchar'),{[Op.iLike]: `%${filterTokens[2]}%`}));          
        }
      }
    });
  }

  


    

  // result["where"] = cast;

  const reqOrders = req.query.order;
  const hideModelAssotiations = req.query.simple;

  let orderStr = [];

  if (reqOrders) {
    let Orders = reqOrders.replace('\[', '').replace('\]', '').split(',');
    orderStr = (Orders.length > 0) ? Orders : [];
  } else {
    orderStr = [];
  }
 

  if (filterStr) {
    
    if (result["where"]) {
      let resWhere = Object.assign({}, result["where"], filterStr);
      result["where"] = resWhere;
    } else {
      result["where"] = filterStr;
    }

    if (!(/true/i).test(hideModelAssotiations)) {
      result["include"] = [{ all: true }]
    }
  }

  if (orderStr.length > 0 && orderStr[0] !== '') {
    result["order"] = orderStr;
  } else if (options.order) {
    result["order"] = options.order
  } else {
    result["order"] = [["createdAt", "DESC"]];
  }

  return {
    ...result,
    include: options.include ? options.include : result.include
  };
};

db.sequelize = sequelize;
db.paginate = paginate;

module.exports = db;
