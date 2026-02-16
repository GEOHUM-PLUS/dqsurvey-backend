const express = require('express');
const router = express.Router();
const pool = require('../config/connection');

router.post('/section4', async (req, res) => {
  const client = await pool.connect();

  try {
    const d = req.body;

    await client.query('BEGIN');

    // Insert Main Section4
    const mainResult = await client.query(`
      INSERT INTO section4_conformance (
        section1_id, section2_id, section3_id,

        values_completeness,
        attribute_completeness,
        thematic_selectivity,
        spatial_variability,
        completeness_score,

        topo_consistency,
        domain_consistency,
        thematic_consistency,
        spatial_consistency,
        inconsistency_sources,
        consistency_score,

        accuracy_type,
        thematic_accuracy,
        attribute_accuracy,
        model_performance,
        data_plausibility,

        validation_method,
        validation_data,
        temporal_stability,
        thematic_stability,
        spatial_stability,
        uncertainty_analyses,
        uncertainty_sources,
        accuracy_score,

        method_clarity,
        method_docs_link,
        method_reputation,
        method_transferability,
        code_availability,
        code_repo,
        resources_needed,
        reproducibility_score,

        traceability,
        input_consistency,
        input_data_fit,
        input_score,
        step4
      )
      VALUES (
        $1,$2,$3,
        $4,$5,$6,$7,$8,
        $9,$10,$11,$12,$13,$14,
        $15,$16,$17,$18,$19,
        $20,$21,$22,$23,$24,$25,$26,$27,
        $28,$29,$30,$31,$32,$33,$34,$35,
        $36,$37,$38,$39,$40
      )
      RETURNING id
    `, [
      d.section1Id,
      d.section2Id,
      d.section3Id,

      d.valuesCompleteness,
      d.attributeCompleteness,
      d.thematicSelectivity,
      d.spatialVariability,
      d.completenessScore,

      d.topoConsistency,
      d.domainConsistency,
      d.thematicConsistency,
      d.spatialConsistency,
      d.inconsistencySources,
      d.consistencyScore,

      d.accuracyType,
      d.thematicAccuracy,
      d.attributeAccuracy,
      d.modelPerformance,
      d.dataPlausibility,

      d.validationMethod,
      d.validationData,
      d.temporalStability,
      d.thematicStability,
      d.spatialStability,
      d.uncertaintyAnalyses,
      d.uncertaintySources,
      d.accuracyScore,

      d.methodClarity,
      d.methodDocsLink,
      d.methodReputation,
      d.methodTransferability,
      d.codeAvailability,
      d.codeRepo,
      d.resourcesNeeded,
      d.reproducibilityScore,

      d.traceability,
      d.inputConsistency,
      d.inputDataFit,
      d.inputScore,
      0
    ]);

    const section4Id = mainResult.rows[0].id;

    // Insert Input Dataset Entries
    if (d.inputDatasets && d.inputDatasets.length > 0) {
      for (const ds of d.inputDatasets) {
        await client.query(`
          INSERT INTO section4_input_datasets (
            section4_id,
            dataset_name,
            dataset_link,
            dataset_score
          )
          VALUES ($1,$2,$3,$4)
        `, [
          section4Id,
          ds.name,
          ds.link,
          ds.score
        ]);
      }
    }

    await client.query('COMMIT');

    res.json({
      success: true,
      section4_id: section4Id
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Section4 DB error' });
  } finally {
    client.release();
  }
});

// GET section4 by section1Id, section2Id, section3Id (including input datasets)
router.get('/bySection1And2And3/:section4Id/:section1Id/:section2Id/:section3Id', async (req, res) => {
  try {
    const { section4Id, section1Id, section2Id, section3Id } = req.params;

    if (!section1Id || !section2Id || !section3Id) {
      return res.status(400).json({ success: false, message: "Missing required IDs" });
    }

    // 1️⃣ Get Section4 main record
    const section4Result = await pool.query(
      `SELECT * FROM section4_conformance 
       WHERE id = $1
       AND section1_id = $2 
       AND section2_id = $3 
       AND section3_id = $4`,
      [parseInt(section4Id), parseInt(section1Id), parseInt(section2Id), parseInt(section3Id)]
    );

    if (section4Result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No Section4 data found'
      });
    }

    const section4 = section4Result.rows[0];

    // 2️⃣ Get related input datasets
    const inputDatasetResult = await pool.query(
      `SELECT * FROM section4_input_datasets 
       WHERE section4_id = $1`,
      [section4.id]  // assuming section4.id is primary key
    );

    section4.inputDatasets = inputDatasetResult.rows; // attach as array

    res.json(section4);

  } catch (err) {
    console.error('Section4 GET Error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching section4'
    });
  }
});

module.exports = router;
