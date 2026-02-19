const express = require('express');
const router = express.Router();
const pool = require('../config/connection');

function arrayToBulletText(arr) {
    if (!arr || !Array.isArray(arr)) return null;

    return arr
        .filter(v => v && v.trim() !== "")
        // .map(v => `• ${v}`) // Add bullet points
        .map((v, i) => `${i + 1}. ${v}`) // Add numbered points
        .join('\n');
}

router.post('/section5', async (req, res) => {

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const {
            section1Id,
            section2Id,
            section3Id,
            section4Id,

            creator,
            contributors,
            publisher,
            trustProducer,
            relations,
            relationsUrl,
            frequencyUse,
            audience,
            familiarity,
            scoreReputation,

            strengths,
            limitations,
            relevanceUsecase,
            impactStrengths,
            impactLimitations,
            scoreRelevance,

            constraints,
            modelDataFit,
            scoreApplicability,

            spatialHomogeneity,
            usabilityLocations,
            scoreTransferability,
            step5
        } = req.body;

        const insertQuery = `
      INSERT INTO section5_context (
        section1_id, section2_id, section3_id, section4_id,

        creator, contributors, publisher, trust_producer,
        relations, relations_url, frequency_use, audience, familiarity,
        score_reputation,

        strengths, limitations,
        relevance_usecase, impact_strengths, impact_limitations,
        score_relevance,

        constraints, model_data_fit, score_applicability,

        spatial_homogeneity, usability_locations, score_transferability,step5
      )
      VALUES (
        $1,$2,$3,$4,
        $5,$6,$7,$8,
        $9,$10,$11,$12,$13,
        $14,
        $15,$16,
        $17,$18,$19,
        $20,
        $21,$22,$23,
        $24,$25,$26,$27
      )
      RETURNING section5_id;
    `;

        const values = [
            section1Id,
            section2Id,
            section3Id,
            section4Id,

            creator,
            contributors,
            publisher,
            trustProducer,
            relations,
            relationsUrl,
            frequencyUse,
            audience,
            familiarity,
            scoreReputation,

            //   strengths || [],
            arrayToBulletText(strengths),
            //   limitations || [],
            arrayToBulletText(limitations),
            relevanceUsecase,
            impactStrengths,
            impactLimitations,
            scoreRelevance,

            //   constraints || [],
            arrayToBulletText(constraints),

            modelDataFit,
            scoreApplicability,

            spatialHomogeneity,
            usabilityLocations,
            scoreTransferability,
            0
        ];


        const result = await client.query(insertQuery, values);

        await client.query('COMMIT');

        res.status(200).json({
            success: true,
            section5_id: result.rows[0].section5_id
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Section5 Insert Error:", err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    } finally {
        client.release();
    }
});


// GET section5 by section1Id, section2Id, section3Id, section4Id
router.get(
    ['/bySection1And2And3/:section1Id/:section2Id/:section3Id/:section5Id', '/bySection1And2And3/:section1Id/:section2Id/:section3Id/:section4Id/:section5Id'],
    async (req, res) => {

        try {

            const { section1Id, section2Id, section3Id, section4Id, section5Id } = req.params;

            console.log('Fetching Section5 for:', {
                section1Id,
                section2Id,
                section3Id,
                section4Id,
                section5Id
            });

            let query;
            let values;

            if (section4Id && section4Id !== 'null') {

                // Case: Section4 exists
                query = `
        SELECT *
        FROM section5_context
        WHERE section1_id = $1
        AND section2_id = $2
        AND section3_id = $3
        AND section4_id = $4
        AND section5_id = $5
      `;

                values = [section1Id, section2Id, section3Id, section4Id, section5Id];

            } else {

                // Case: Section4 skipped (Primary workflow)
                query = `
        SELECT *
        FROM section5_context
        WHERE section1_id = $1
        AND section2_id = $2
        AND section3_id = $3
        AND section4_id IS NULL
        AND section5_id = $4
      `;

                values = [section1Id, section2Id, section3Id, section5Id];
            }

            const result = await pool.query(query, values);

            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No Section5 data found'
                });
            }

            res.json(result.rows[0]);

            // console.log('Fetched Section5 with ID:', section5Id);

        } catch (err) {
            console.error('Section5 GET Error:', err);
            res.status(500).json({
                success: false,
                message: 'Error fetching section5'
            });
        }
    });

module.exports = router;
