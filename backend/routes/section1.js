const express = require('express');
const router = express.Router();
const pool = require('../config/connection'); // your pg pool
// POST api for section1
router.post('/section1', async (req, res) => {
  try {

    const d = req.body;
    const optimumDataCollection = d.optimumDataCollection || null;

    // --- AOI sanitization based on aoiType ---
    let aoiDropdown = d.aoiDropdown || null;
    let minLat = d.minLat ? parseFloat(d.minLat) : null;
    let maxLat = d.maxLat ? parseFloat(d.maxLat) : null;
    let minLon = d.minLon ? parseFloat(d.minLon) : null;
    let maxLon = d.maxLon ? parseFloat(d.maxLon) : null;
    let aoiFileName = d.aoiFileName || null;

    if (d.aoiType === 'dropdown') {
      // keep dropdown, clear coords + file
      minLat = maxLat = minLon = maxLon = null;
      aoiFileName = null;
    } else if (d.aoiType === 'coordinates') {
      // keep coords, clear dropdown + file
      aoiDropdown = null;
      aoiFileName = null;
    } else if (d.aoiType === 'upload') {
      // keep file, clear dropdown + coords
      aoiDropdown = null;
      minLat = maxLat = minLon = maxLon = null;
    } else {
      // no selection => clear all
      aoiDropdown = null;
      minLat = maxLat = minLon = maxLon = null;
      aoiFileName = null;
    }

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
      // d.aoiDropdown || null,
      aoiDropdown || null,
      minLat, maxLat, minLon, maxLon,
      // d.aoiFileName || null,
      aoiFileName || null,
      d.otherRequirements || null,

      d.step1 ?? 0  // default to 0 if missing
    ]);

    // console.log('Inserted Section1 with ID:', result.rows[0].id);
    res.json({ success: true, id: result.rows[0].id });

  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET section1 by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT * FROM section1_metadata WHERE id=$1`,
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Section1 GET Error:', err);
    res.status(500).json({ success: false, message: 'Error fetching section1' });
  }
});


// UPDATE section1 by id
router.put('/section1/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const d = req.body;
    const optimumDataCollection = d.optimumDataCollection || null;
    // --- AOI sanitization based on aoiType ---
    let aoiDropdown = d.aoiDropdown || null;
    let minLat = d.minLat ? parseFloat(d.minLat) : null;
    let maxLat = d.maxLat ? parseFloat(d.maxLat) : null;
    let minLon = d.minLon ? parseFloat(d.minLon) : null;
    let maxLon = d.maxLon ? parseFloat(d.maxLon) : null;
    let aoiFileName = d.aoiFileName || null;

    if (d.aoiType === 'dropdown') {
      // keep dropdown, clear coords + file
      minLat = maxLat = minLon = maxLon = null;
      aoiFileName = null;
    } else if (d.aoiType === 'coordinates') {
      // keep coords, clear dropdown + file
      aoiDropdown = null;
      aoiFileName = null;
    } else if (d.aoiType === 'upload') {
      // keep file, clear dropdown + coords
      aoiDropdown = null;
      minLat = maxLat = minLon = maxLon = null;
    } else {
      // no selection => clear all
      aoiDropdown = null;
      minLat = maxLat = minLon = maxLon = null;
      aoiFileName = null;
    }

    const result = await pool.query(`
      UPDATE section1_metadata SET
        dataset_title = $1,
        evaluator_name = $2,
        evaluator_org = $3,
        data_processing_level = $4,
        data_type = $5,
        data_type_other = $6,
        evaluation_type = $7,
        use_case_description = $8,
        optimum_data_collection = $9,

        optimum_pixel_resolution = $10,
        optimum_pixel_unit = $11,
        optimum_gis_resolution = $12,
        optimum_gis_unit = $13,
        optimum_ml_resolution = $14,
        optimum_ml_unit = $15,
        optimum_prediction_spatial_resolution = $16,
        optimum_prediction_spatial_unit = $17,
        optimum_prediction_temporal = $18,

        optimum_survey_level1 = $19,
        optimum_survey_level2 = $20,
        optimum_other_resolution = $21,

        aoi_type = $22,
        aoi_dropdown = $23,

        min_lat = $24,
        max_lat = $25,
        min_lon = $26,
        max_lon = $27,

        aoi_file_name = $28,
        other_requirements = $29,
        step1 = $30
      WHERE id = $31
      RETURNING id
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
      // d.aoiDropdown || null,
      aoiDropdown || null,
      minLat, maxLat, minLon, maxLon,

      // d.aoiFileName || null,
      aoiFileName || null,
      d.otherRequirements || null,
      d.step1 ?? 1,      // ✅ edit/update ke time step1 usually 1 rakho
      id
    ]);

    if (!result.rowCount) {
      return res.status(404).json({ success: false, error: 'Record not found' });
    }

    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error('Section1 UPDATE Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});



module.exports = router;
