# Evaluation Harness and Metrics

This repository includes a rigorous evaluation harness for the RAG and eligibility components.

## Calibration and Held-out Splits
The evaluation set is strictly split into a calibration half and a held-out half. 
- **Rule of Honesty**: The calibration and held-out split was fixed before threshold selection. No data, chunk, or prompt was changed after seeing held-out results.
- Thresholds are chosen exclusively on the calibration set.
- Metrics are reported exclusively on the held-out set.

## Metrics Definitions

### Retrieval (Hit@1, Hit@3, MRR)
- **Hit@1**: The proportion of answerable questions where the top-1 retrieved chunk is in the expected chunks.
- **Hit@3**: The proportion of answerable questions where the correct chunk is within the top-3 retrieved chunks.
- **MRR (Mean Reciprocal Rank)**: The average of the reciprocal of the rank of the first correct retrieved chunk (0 if not in top K).

### Decision & Grounding
- **Precision**: Grounded answers whose retrieved chunk was actually correct ÷ all grounded answers. (Measures "When the system answers, is it right?").
- **Recall**: Answerable questions grounded with the correct chunk ÷ all answerable questions. (Measures "How many valid questions did the system successfully answer?").
- **F0.5 Score**: The harmonic mean of Precision and Recall, weighted to favor Precision. 
  - *Why F0.5?* In a government benefits context, giving incorrect, ungrounded advice (false grounding) is much worse than refusing to answer (false refusal). We strongly favor Precision.

### Refusal & Out-of-Scope
- **Correct Refusal Rate**: The proportion of out-of-scope questions that the system safely refused to answer.
- **False Grounding Rate**: The proportion of out-of-scope questions that the system attempted to answer (hallucination or forcing a fit).

## Baseline
- **BM25 Keyword Baseline**: A standard term-frequency/inverse-document-frequency keyword search (implemented natively).
- The baseline is evaluated on the exact same chunks and same splits, using the same calibration method to pick a threshold, allowing a true apples-to-apples comparison against the semantic embedding approach.

## Limitations
- **Small Sample Size**: If a split contains fewer than 30 items, metric variances are high. 95% Wilson confidence intervals are provided on the report cards to reflect this uncertainty.
