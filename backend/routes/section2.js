const express = require('express');
const router = express.Router();
const pool = require('../config/connection');

router.post('/section2', async (req, res) => {
  try {
    const d = req.body;

    const result = await pool.query(`
      INSERT INTO section2_descriptives (
        section1_id,
        identifier,
        identifier_type,
        dataset_description,
        dataset_description_link,
        keywords,
        language,
        metadata_documentation,
        metadata_standards,
        score_metadata_documentation,
        access_restrictions,
        api_availability,
        usage_rights,
        data_format,
        format_standards,
        score_accessibility,
        crs,
        positional_accuracy,
        spatial_uncertainty,
        score_spatial_accuracy,
        step2
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21
      )
      RETURNING id
    `, [
      d.section1Id,
      d.identifier || null,
      d.identifier_type || null,
      d.dataset_description || null,
      d.dataset_description_link || null,
      //   d.keywords ? JSON.parse(d.keywords) : null,
      // d.keywords || null,
      d.keywords ? JSON.stringify(d.keywords) : null, // ✅ FIX

      d.language || null,
      d.metadata_documentation || null,
      d.metadata_standards || null,
      d.score_metadata_documentation ? parseInt(d.score_metadata_documentation) : null,
      d.access_restrictions || null,
      d.api_availability || null,
      d.usage_rights || null,
      d.data_format || null,
      d.format_standards || null,
      d.score_accessibility ? parseInt(d.score_accessibility) : null,
      d.crs || null,
      d.positional_accuracy || null,
      d.spatial_uncertainty || null,
      d.score_spatial_accuracy ? parseInt(d.score_spatial_accuracy) : null,
      0   // step2 default
    ]);

    res.json({ success: true, id: result.rows[0].id });

  } catch (err) {
    console.error("Section2 Insert Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET section2 by section1Id
router.get('/bySection1/:section2Id/:section1Id', async (req, res) => {
  try {
    const { section2Id, section1Id } = req.params;
    const result = await pool.query(
      `SELECT * FROM section2_descriptives WHERE id=$1
    AND section1_id=$2`,
      [section2Id, section1Id]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error('Section2 GET Error:', err);
    res.status(500).json({ success: false, message: 'Error fetching section2' });
  }
});


// UPDATE section2 by id
router.put('/section2/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const d = req.body;

    const result = await pool.query(`
      UPDATE section2_descriptives SET
        identifier = $1,
        identifier_type = $2,
        dataset_description = $3,
        dataset_description_link = $4,
        keywords = $5,
        language = $6,
        metadata_documentation = $7,
        metadata_standards = $8,
        score_metadata_documentation = $9,
        access_restrictions = $10,
        api_availability = $11,
        usage_rights = $12,
        data_format = $13,
        format_standards = $14,
        score_accessibility = $15,
        crs = $16,
        positional_accuracy = $17,
        spatial_uncertainty = $18,
        score_spatial_accuracy = $19,
        step2 = 0
      WHERE id = $20
      AND section1_id = $21
      RETURNING id
    `, [
      d.identifier || null,
      d.identifier_type || null,
      d.dataset_description || null,
      d.dataset_description_link || null,
      d.keywords ? JSON.stringify(d.keywords) : null,

      d.language || null,
      d.metadata_documentation || null,
      d.metadata_standards || null,
      d.score_metadata_documentation != null ? parseInt(d.score_metadata_documentation) : null,

      d.access_restrictions || null,
      d.api_availability || null,
      d.usage_rights || null,

      d.data_format || null,
      d.format_standards || null,
      d.score_accessibility != null ? parseInt(d.score_accessibility) : null,

      d.crs || null,
      d.positional_accuracy || null,
      d.spatial_uncertainty || null,
      d.score_spatial_accuracy != null ? parseInt(d.score_spatial_accuracy) : null,

      id,
      d.section1Id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Section2 row not found for update" });
    }

    res.json({ success: true, id: result.rows[0].id });

  } catch (err) {
    console.error("Section2 UPDATE Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
