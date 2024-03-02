function applyExtraSetup(sequelize) {
    /*
    const { instrument, orchestra } = sequelize.models;

    orchestra.hasMany(instrument);
    instrument.belongsTo(orchestra);
    */

    const { user, tweet } = sequelize.models;

    user.hasMany(tweet);
    tweet.belongsTo(user);
}

module.exports = { applyExtraSetup };
