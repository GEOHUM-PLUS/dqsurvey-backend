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
    // console.log('Payload received:', d);
    res.json({
      success: true,
      section3_id: result.rows[0].id
    });

  } catch (err) {
    console.error('❌ Section3 DB Error:', err);
    res.status(500).json({ message: 'Database error' });
  }
});

// GET section3 by
router.get('/bySection1And2/:section3Id/:section1Id/:section2Id', async (req, res) => {
  try {

    const { section3Id, section1Id, section2Id } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM section3_design
      WHERE 
      id = $1
      AND section1_id = $2
      AND section2_id = $3
      `,
      [section3Id, section1Id, section2Id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No Section3 data found'
      });
    }

    res.json(result.rows[0]);

    console.log('Fetched Section2:', result.rows[0]);

  } catch (err) {
    console.error('Section3 GET Error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching section3'
    });
  }
});

// UPDATE section3 by id
router.put('/section3/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const d = req.body;

    const result = await pool.query(`
      UPDATE section3_design SET
        pixel_resolution_value = $1,
        pixel_resolution_unit = $2,
        grid_resolution_value = $3,
        grid_resolution_unit = $4,
        output_resolution_value = $5,
        output_resolution_unit = $6,
        aggregation_resolution_level = $7,

        general_resolution_score = $8,
        usecase_resolution_score = $9,
        optimal_resolution = $10,
        spatial_fit = $11,
        spatial_deviation = $12,
        spatial_fit_score = $13,

        general_extent = $14,
        general_extent_details = $15,
        general_coverage_score = $16,

        aoi_coverage = $17,
        cloud_cover = $18,
        coverage_deviation = $19,
        coverage_fit_score = $20,

        collection_date = $21,
        temporal_resolution = $22,
        latest_update = $23,
        temporal_extent = $24,
        temporal_validity = $25,

        general_timeliness_score = $26,
        optimum_collection_date = $27,
        temporal_deviation = $28,
        temporal_fit_score = $29,

        step3 = 0
      WHERE id = $30
      RETURNING id
    `, [
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

      id
    ]);
    // console.log('Payload received:', d);
    res.json({ success: true, section3_id: result.rows[0].id });
  } catch (err) {
    console.error('❌ Section3 UPDATE Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});


module.exports = router;
