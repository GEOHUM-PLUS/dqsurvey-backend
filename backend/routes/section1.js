const express = require('express');
const router = express.Router();
const pool = require('../config/connection'); // your pg pool

router.post('/section1', async (req, res) => {
  try {
    const d = req.body;
    // console.log('Payload received:', d);

    // Convert numeric fields or null
    const minLat = d.minLat ? parseFloat(d.minLat) : null;
    const maxLat = d.maxLat ? parseFloat(d.maxLat) : null;
    const minLon = d.minLon ? parseFloat(d.minLon) : null;
    const maxLon = d.maxLon ? parseFloat(d.maxLon) : null;

    const optimumDataCollection = d.optimumDataCollection || null;

    const result = await pool.query(`
      INSERT INTO section1_metadata (
        dataset_title, evaluator_name, evaluator_org,
        data_processing_level, data_type, data_type_other,
        evaluation_type, use_case_description, optimum_data_collection,
        optimum_pixel_resolution, optimum_pixel_unit,
        optimum_gis_resolution, optimum_gis_unit,
        optimum_ml_resolution, optimum_ml_unit,
        optimum_prediction_spatial_resolution, optimum_prediction_spatial_unit,
        optimum_prediction_temporal,
        optimum_survey_level1, optimum_survey_level2,
        optimum_other_resolution,
        aoi_type, aoi_dropdown,
        min_lat, max_lat, min_lon, max_lon,
        aoi_file_name,
        other_requirements,
        step1
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,
        $10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,
        $22,$23,$24,$25,$26,$27,$28,$29,$30
      ) RETURNING id
    `, [
      d.datasetTitle || null,
      d.evaluatorName || null,
      d.evaluatorOrg || null,
      d.dataProcessingLevel || null,
      d.dataType || null,
      d.dataTypeOther || null,
      d.evaluationType || null,
      d.useCaseDescription || null,
      optimumDataCollection,

      d.optimumPixelResolution || null,
      d.optimumPixelResolutionUnit || null,
      d.optimumGISResolution || null,
      d.optimumGISResolutionUnit || null,
      d.optimumMLResolution || null,
      d.optimumMLUnit || null,
      d.optimumPredictionSpatialResolution || null,
      d.optimumPredictionSpatialResolutionUnit || null,
      d.optimumPredictionTemporalResolution || null,
      d.optimumSurveyAggregation1 || null,
      d.optimumSurveyAggregation2 || null,
      d.optimumOtherResolution || null,

      d.aoiType || null,
      d.aoiDropdown || null,
      minLat, maxLat, minLon, maxLon,
      d.aoiFileName || null,
      d.otherRequirements || null,

      d.step1 ?? 0  // default to 0 if missing
    ]);

    console.log('Inserted Section1 with ID:', result.rows[0].id);
    res.json({ success: true, id: result.rows[0].id });

  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET section1 id by evaluatorName (not nesasarily the last one)
router.get('/byEvaluator/:name', async (req, res) => {
  try {
    const evaluatorName = req.params.name;

    const result = await pool.query(
      `SELECT id FROM section1_metadata 
       WHERE evaluator_name = $1 
       ORDER BY id DESC LIMIT 1`,
      [evaluatorName]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No Section1 found for evaluator" });
    }

    res.json({ id: result.rows[0].id });

  } catch (err) {
    console.error("Error fetching Section1 by evaluator:", err);
    res.status(500).json({ message: "Database error" });
  }
});

// GET last inserted section1 id
router.get('/last-id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id
      FROM section1_metadata
      ORDER BY id DESC
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No records found'
      });
    }

    res.json({
      success: true,
      id: result.rows[0].id
    });

  } catch (err) {
    console.error('Error fetching last Section1 ID:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});


module.exports = router;
