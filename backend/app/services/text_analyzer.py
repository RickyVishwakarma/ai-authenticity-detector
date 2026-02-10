"""
Text Analysis Service — Now with REAL AI Detection!
Uses RoBERTa fine-tuned on GPT-generated text + heuristic signals.
"""

import re
import math
from collections import Counter

# Try loading HuggingFace model
try:
    from transformers import pipeline
    print("Loading AI text detection model...")
    ai_detector = pipeline(
        "text-classification",
        model="roberta-base-openai-detector",
        device=-1,  # CPU (-1), use 0 for GPU
    )
    HAS_MODEL = True
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"⚠️ Model not available, using heuristics only: {e}")
    ai_detector = None
    HAS_MODEL = False


class TextAnalyzer:

    AI_VOCABULARY = {
        "delve", "tapestry", "landscape", "multifaceted", "utilize",
        "leverage", "paradigm", "holistic", "synergy", "ecosystem",
        "streamline", "facilitate", "comprehensive", "robust", "innovative",
        "cutting-edge", "groundbreaking", "pivotal", "nuanced", "intricate",
        "furthermore", "moreover", "consequently", "nevertheless", "notwithstanding",
        "aforementioned", "henceforth", "thereby", "thereof", "wherein",
        "encompasses", "underscores", "underpin", "realm", "myriad",
        "plethora", "paramount", "indispensable", "imperative", "meticulous",
    }

    TRANSITION_WORDS = {
        "however", "moreover", "furthermore", "additionally", "consequently",
        "nevertheless", "therefore", "specifically", "essentially", "ultimately",
        "meanwhile", "subsequently", "accordingly", "conversely", "similarly",
        "notably", "importantly", "significantly", "interestingly", "surprisingly",
    }

    def analyze(self, text: str) -> dict:
        words = text.split()
        sentences = [s.strip() for s in re.split(r"[.!?]+", text) if s.strip()]

        if len(words) < 5 or len(sentences) < 1:
            return self._empty_result()

        signals = []
        ai_score = 0.0

        # ═══════════════════════════════════════════
        # REAL ML MODEL PREDICTION
        # ═══════════════════════════════════════════
        ml_score = None
        if HAS_MODEL and ai_detector:
            try:
                # Model accepts max 512 tokens, truncate if needed
                truncated = text[:2000]
                result = ai_detector(truncated)
                label = result[0]["label"]    # "LABEL_0" = Real, "LABEL_1" = Fake/AI
                score = result[0]["score"]

                if label == "LABEL_1" or label == "Fake":
                    ml_score = round(score * 100, 1)
                else:
                    ml_score = round((1 - score) * 100, 1)

                signals.append({
                    "label": f"🧠 ML Model: RoBERTa AI detector",
                    "weight": "high" if ml_score > 70 else "medium" if ml_score > 45 else "low",
                    "detail": f"Model confidence: {ml_score}% AI-generated (RoBERTa fine-tuned on GPT outputs)",
                })

                # ML model gets heavy weight
                ai_score += ml_score * 0.5

            except Exception as e:
                signals.append({
                    "label": "ML model error — using heuristics only",
                    "weight": "low",
                    "detail": str(e),
                })

        # ═══════════════════════════════════════════
        # HEURISTIC SIGNALS (same as before)
        # ═══════════════════════════════════════════

        # --- Signal: Burstiness ---
        sent_lengths = [len(s.split()) for s in sentences]
        burstiness = self._compute_burstiness(sent_lengths)
        if burstiness < 3.5 and len(sentences) > 3:
            ai_score += 11
            signals.append({
                "label": "Low burstiness — unnaturally uniform sentence flow",
                "weight": "high",
                "detail": f"Score: {burstiness:.2f} (human avg: 6-12)",
            })
        elif burstiness < 5.0 and len(sentences) > 3:
            ai_score += 5
            signals.append({
                "label": "Moderate burstiness",
                "weight": "medium",
                "detail": f"Score: {burstiness:.2f}",
            })

        # --- Signal: Lexical Diversity ---
        unique_words = set(w.lower().strip(".,!?;:'\"") for w in words)
        lexical_diversity = len(unique_words) / len(words) if words else 0
        if lexical_diversity < 0.50:
            ai_score += 9
            signals.append({
                "label": "Low lexical diversity",
                "weight": "high",
                "detail": f"Ratio: {lexical_diversity:.3f} (human avg: 0.6-0.8)",
            })
        elif lexical_diversity < 0.58:
            ai_score += 4
            signals.append({
                "label": "Below-average lexical diversity",
                "weight": "medium",
                "detail": f"Ratio: {lexical_diversity:.3f}",
            })

        # --- Signal: Transition Word Density ---
        transition_count = sum(
            1 for w in words if w.lower().strip(".,;:") in self.TRANSITION_WORDS
        )
        transition_density = transition_count / len(words)
        if transition_density > 0.025:
            ai_score += 8
            signals.append({
                "label": "High transition word density",
                "weight": "high",
                "detail": f"{transition_count} transitions in {len(words)} words",
            })
        elif transition_density > 0.015:
            ai_score += 4
            signals.append({
                "label": "Elevated transition word usage",
                "weight": "medium",
                "detail": f"Density: {transition_density:.4f}",
            })

        # --- Signal: AI Vocabulary ---
        ai_vocab_hits = [
            w for w in words
            if w.lower().strip(".,;:'\"!?") in self.AI_VOCABULARY
        ]
        if len(ai_vocab_hits) >= 3:
            ai_score += 8
            signals.append({
                "label": "AI-associated vocabulary detected",
                "weight": "high",
                "detail": f"Found: {', '.join(set(w.lower() for w in ai_vocab_hits[:5]))}",
            })
        elif len(ai_vocab_hits) >= 1:
            ai_score += 3
            signals.append({
                "label": "AI-associated vocabulary detected",
                "weight": "low",
                "detail": f"Found: {', '.join(set(w.lower() for w in ai_vocab_hits[:3]))}",
            })

        # --- Signal: Sentence Structure ---
        if len(sentences) >= 4:
            structure_score = self._sentence_structure_uniformity(sentences)
            if structure_score > 0.7:
                ai_score += 7
                signals.append({
                    "label": "Repetitive sentence structure",
                    "weight": "high",
                    "detail": f"Uniformity: {structure_score:.2f}",
                })

        # --- Signal: Word Length ---
        avg_word_len = sum(len(w) for w in words) / len(words)
        if avg_word_len > 5.5:
            ai_score += 4
            signals.append({
                "label": "High average word length",
                "weight": "low",
                "detail": f"Average: {avg_word_len:.1f} chars (human avg: 4.5-5.2)",
            })

        # Perplexity
        perplexity_estimate = self._estimate_perplexity(words)

        # Normalize
        ai_score = max(5, min(98, ai_score))

        if ai_score > 65:
            prediction = "ai_generated"
        elif ai_score > 40:
            prediction = "uncertain"
        else:
            prediction = "human_created"

        if not signals:
            signals.append({"label": "No strong AI indicators", "weight": "low", "detail": ""})

        metrics = {
            "word_count": len(words),
            "sentence_count": len(sentences),
            "perplexity_estimate": round(perplexity_estimate, 1),
            "burstiness": round(burstiness, 2),
            "lexical_diversity": round(lexical_diversity, 4),
            "avg_sentence_length": round(len(words) / max(len(sentences), 1), 1),
            "avg_word_length": round(avg_word_len, 1),
            "transition_density": round(transition_density, 4),
        }

        if ml_score is not None:
            metrics["ml_model_score"] = ml_score
            metrics["model_name"] = "roberta-base-openai-detector"

        return {
            "prediction": prediction,
            "ai_probability": round(ai_score, 1),
            "human_probability": round(100 - ai_score, 1),
            "signals": signals,
            "metrics": metrics,
        }

    def _compute_burstiness(self, sent_lengths):
        if len(sent_lengths) < 2:
            return 10.0
        mean = sum(sent_lengths) / len(sent_lengths)
        variance = sum((l - mean) ** 2 for l in sent_lengths) / len(sent_lengths)
        return math.sqrt(variance)

    def _variance(self, values):
        if len(values) < 2:
            return 0.0
        mean = sum(values) / len(values)
        return sum((v - mean) ** 2 for v in values) / len(values)

    def _sentence_structure_uniformity(self, sentences):
        first_words = [s.split()[0].lower() if s.split() else "" for s in sentences]
        length_buckets = [len(s.split()) // 5 for s in sentences]
        first_word_freq = max(Counter(first_words).values()) / len(first_words)
        bucket_freq = max(Counter(length_buckets).values()) / len(length_buckets)
        return (first_word_freq + bucket_freq) / 2

    def _estimate_perplexity(self, words):
        word_freq = Counter(w.lower() for w in words)
        total = len(words)
        if total == 0:
            return 100.0
        entropy = -sum(
            (count / total) * math.log2(count / total)
            for count in word_freq.values()
            if count > 0
        )
        return 2 ** entropy

    def _empty_result(self):
        return {
            "prediction": "uncertain",
            "ai_probability": 50.0,
            "human_probability": 50.0,
            "signals": [{"label": "Insufficient text", "weight": "low", "detail": ""}],
            "metrics": {},
        }