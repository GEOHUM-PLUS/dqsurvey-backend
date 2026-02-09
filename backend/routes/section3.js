const express = require('express');
const router = express.Router();
const pool = require('../config/connection');

router.post('/section3', async (req, res) => {
  try {
    const d = req.body;

    if (!d.section1Id || !d.section2Id) {
      return res.status(400).json({ message: 'Missing section IDs' });
    }

    const result = await pool.query(`
      INSERT INTO section3_design (
        section1_id, section2_id,

        pixel_resolution_value, pixel_resolution_unit,
        grid_resolution_value, grid_resolution_unit,
        output_resolution_value, output_resolution_unit,
        aggregation_resolution_level,

        general_resolution_score,
        usecase_resolution_score,
        optimal_resolution,
        spatial_fit,
        spatial_deviation,
        spatial_fit_score,

        general_extent,
        general_extent_details,
        general_coverage_score,

        aoi_coverage,
        cloud_cover,
        coverage_deviation,
        coverage_fit_score,

        collection_date,
        temporal_resolution,
        latest_update,
        temporal_extent,
        temporal_validity,

        general_timeliness_score,
        optimum_collection_date,
        temporal_deviation,
        temporal_fit_score,
        step3
      )
      VALUES (
        $1,$2,
        $3,$4,$5,$6,$7,$8,$9,
        $10,$11,$12,$13,$14,$15,
        $16,$17,$18,
        $19,$20,$21,$22,
        $23,$24,$25,$26,$27,
        $28,$29,$30,$31,$32
      )
      RETURNING id
    `, [
      d.section1Id,
      d.section2Id,

      d.pixelResolutionValue || null,
      d.pixelResolutionUnit || null,
      d.gridResolutionValue || null,
      d.gridResolutionUnit || null,
      d.outputResolutionValue || null,
      d.outputResolutionUnit || null,
      d.aggregationResolutionLevel || null,

      d.generalResolutionScore || null,
      d.useCaseResolutionScore || null,
      d.optimalResolution || null,
      d.spatialFit || null,
      d.spatialDeviation || null,
      d.spatialFitScore || null,

      d.generalExtent || null,
      d.generalExtentDetails || null,
      d.generalCoverageScore || null,

      d.aoiCoverage || null,
      d.cloudCover || null,
      d.coverageDeviation || null,
      d.coverageFitScore || null,

      d.collectionDate || null,
      d.temporalResolution || null,
      d.latestUpdate || null,
      d.temporalExtent || null,
      d.temporalValidity || null,

      d.generalTimelinessScore || null,
      d.optimumCollectionDate || null,
      d.temporalDeviation || null,
      d.temporalFitScore || null,
      0   // step3 default
    ]);
    console.log('Payload received:', d);
    res.json({
      success: true,
      section3_id: result.rows[0].id
    });

  } catch (err) {
    console.error('❌ Section3 DB Error:', err);
    res.status(500).json({ message: 'Database error' });
  }
});

// GET section2 by section1Id
router.get('/bySection1And2/:section1Id/:section2Id', async (req, res) => {
  try {

    const { section1Id, section2Id } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM section3_design
      WHERE section1_id = $1
      AND section2_id = $2
      `,
      [section1Id, section2Id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No Section3 data found'
      });
    }

    res.json(result.rows[0]);


  } catch (err) {
    console.error('Section3 GET Error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching section3'
    });
  }
});


module.exports = router;
