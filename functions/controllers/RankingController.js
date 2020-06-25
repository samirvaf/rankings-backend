const db_connection = require('../db');
const db = db_connection.collection('rankings').doc('levels')

module.exports = {
    async index (req, res) {
        try
        {
            const { level = '1' } = req.query;
            const query = db.collection(level).orderBy('score');
            let response = [];

            await query.get().then((docs) => {
                docs.forEach((doc) => {
                    const currentRanking = {
                        name: doc.data().name,
                        score: doc.data().score,
                    }
                    response.push(currentRanking);
                })

                return res.status(200).json(response);
            })
        } 
        catch (error) 
        {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    async store (req, res) {
        try
        {
            const { level, name, score } = req.body;
            const query = db.collection(level);

            await query.orderBy('score').get().then((docs) => {
                if (docs.size < 10) {
                    const newRanking = {
                        name: name,
                        score: score
                    }
                    query.add(newRanking).then(() => res.status(200).json(null));
                }
                else
                {
                    let docToUpdate = null;
                    docs.forEach((doc) => {
                        if (doc.data().score < score && !docToUpdate) {
                            docToUpdate = doc.id;
                        }
                    })
                    
                    if (docToUpdate) {
                        query.doc(docToUpdate).update({
                            name: name,
                            score: score
                        })
                    }
                    return res.status(200).json(null);
                }
            })
        }
        catch (error)
        {
            console.log(error);
            return res.status(500).send(error);
        }
    }
}
