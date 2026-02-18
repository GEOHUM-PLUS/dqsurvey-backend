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


// ✅ UPDATE section4 (main + input datasets)
router.put('/section4/:section4Id', async (req, res) => {
  const client = await pool.connect();

  try {
    const { section4Id } = req.params;
    const d = req.body;

    if (!section4Id || !d.section1Id || !d.section2Id || !d.section3Id) {
      return res.status(400).json({ success: false, message: "Missing required IDs" });
    }

    await client.query('BEGIN');

    // 1) UPDATE main record
    const updateResult = await client.query(`
      UPDATE section4_conformance
      SET
        values_completeness = $1,
        attribute_completeness = $2,
        thematic_selectivity = $3,
        spatial_variability = $4,
        completeness_score = $5,

        topo_consistency = $6,
        domain_consistency = $7,
        thematic_consistency = $8,
        spatial_consistency = $9,
        inconsistency_sources = $10,
        consistency_score = $11,

        accuracy_type = $12,
        thematic_accuracy = $13,
        attribute_accuracy = $14,
        model_performance = $15,
        data_plausibility = $16,

        validation_method = $17,
        validation_data = $18,
        temporal_stability = $19,
        thematic_stability = $20,
        spatial_stability = $21,
        uncertainty_analyses = $22,
        uncertainty_sources = $23,
        accuracy_score = $24,

        method_clarity = $25,
        method_docs_link = $26,
        method_reputation = $27,
        method_transferability = $28,
        code_availability = $29,
        code_repo = $30,
        resources_needed = $31,
        reproducibility_score = $32,

        traceability = $33,
        input_consistency = $34,
        input_data_fit = $35,
        input_score = $36,

        step4 = $37
      WHERE id = $38
        AND section1_id = $39
        AND section2_id = $40
        AND section3_id = $41
      RETURNING id
    `, [
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

      1, // ✅ step4 set to 1 on update
      Number(section4Id),
      Number(d.section1Id),
      Number(d.section2Id),
      Number(d.section3Id)
    ]);

    if (updateResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ success: false, message: "Section4 record not found for update" });
    }

    // 2) DELETE old input datasets
    await client.query(`DELETE FROM section4_input_datasets WHERE section4_id = $1`, [Number(section4Id)]);

    // 3) INSERT new input datasets
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
          Number(section4Id),
          ds.name || null,
          ds.link || null,
          ds.score !== undefined && ds.score !== null && ds.score !== "" ? Number(ds.score) : null
        ]);
      }
    }

    await client.query("COMMIT");

    res.json({
      success: true,
      section4_id: Number(section4Id),
      updated: true
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Section4 UPDATE Error:", err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    client.release();
  }
});


module.exports = router;
