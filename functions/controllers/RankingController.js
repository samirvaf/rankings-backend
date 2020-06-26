let yup = require('yup');
const db_connection = require('../db');
const db = db_connection.collection('rankings').doc('levels')

module.exports = {
    async index (req, res) {
        const schema = yup.object().shape({
            level: yup
                .number()
                .min(1)
                .max(3)
                .required()
        })

        if (!(await schema.isValid(req.query))) {
            return res.status(400).json({ error: 'Validation failed' });
        }

        const { level } = req.query;
        const query = db.collection(level).orderBy('score', 'desc').limit(10);
        let response = [];

        await query.get().then((docs) => {
            docs.forEach((doc) => {
                const currentRanking = {
                    name: doc.data().name,
                    score: doc.data().score,
                }
                response.push(currentRanking);
            })

            return res.json({ "top_players": response });
        })
    },

    async store (req, res) {
        const schema = yup.object().shape({
            level: yup
                .number()
                .min(1)
                .max(3)
                .required(),
            name: yup
                .string()
                .required(),
            score: yup
                .number()
                .positive()
                .required()
        })

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation failed' });
        }

        const { level, name, score } = req.body;

        const query = db.collection(level);

        await query.add({
            name: name,
            score: score
        })

        return res.json({ name, score });
    }
}
