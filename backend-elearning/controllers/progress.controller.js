const db = require('../config/db');

// ✅ Marquer un chapitre comme terminé + recalculer progression
exports.markCompleted = (req, res) => {
  const studentId = req.userId;
  const { chapter_id } = req.body;

  // 1. Insérer dans chapter_progress (IGNORE si déjà fait)
  db.query(
    `INSERT IGNORE INTO chapter_progress (student_id, chapter_id)
     VALUES (?, ?)`,
    [studentId, chapter_id],
    (err) => {
      if (err) return res.status(500).json(err);

      // 2. Trouver le course_id du chapitre
      db.query(
        `SELECT course_id FROM chapters WHERE id = ?`,
        [chapter_id],
        (err, chapResult) => {
          if (err) return res.status(500).json(err);
          if (!chapResult.length) return res.status(404).json({ message: 'Chapitre introuvable' });

          const courseId = chapResult[0].course_id;

          // 3. Total chapitres du cours
          db.query(
            `SELECT COUNT(*) as total FROM chapters WHERE course_id = ?`,
            [courseId],
            (err, totalResult) => {
              if (err) return res.status(500).json(err);

              const total = totalResult[0].total;

              // 4. Chapitres complétés par l'étudiant pour ce cours
              db.query(
                `SELECT COUNT(*) as done
                 FROM chapter_progress cp
                 JOIN chapters ch ON ch.id = cp.chapter_id
                 WHERE cp.student_id = ? AND ch.course_id = ?`,
                [studentId, courseId],
                (err, doneResult) => {
                  if (err) return res.status(500).json(err);

                  const done = doneResult[0].done;
                  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

                  // 5. Mettre à jour enrollments.progress
                  db.query(
                    `UPDATE enrollments SET progress = ?
                     WHERE student_id = ? AND course_id = ?`,
                    [percent, studentId, courseId],
                    (err) => {
                      if (err) return res.status(500).json(err);

                      // 6. Retourner la progression complète
                      db.query(
                        `SELECT id FROM chapter_progress cp
                         JOIN chapters ch ON ch.id = cp.chapter_id
                         WHERE cp.student_id = ? AND ch.course_id = ?`,
                        [studentId, courseId],
                        (err, completedRows) => {
                          if (err) return res.status(500).json(err);

                          res.json({
                            percent,
                            total,
                            completed: done,
                            completedChapters: completedRows.map(r => r.id)
                          });
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
};

// 📊 Récupérer la progression pour un cours
exports.getProgress = (req, res) => {
  const studentId = req.userId;
  const courseId = req.params.courseId;

  // Total chapitres
  db.query(
    `SELECT COUNT(*) as total FROM chapters WHERE course_id = ?`,
    [courseId],
    (err, totalResult) => {
      if (err) return res.status(500).json(err);

      const total = totalResult[0].total;

      // Chapitres complétés
      db.query(
        `SELECT cp.chapter_id
         FROM chapter_progress cp
         JOIN chapters ch ON ch.id = cp.chapter_id
         WHERE cp.student_id = ? AND ch.course_id = ?`,
        [studentId, courseId],
        (err, completedRows) => {
          if (err) return res.status(500).json(err);

          const completedChapters = completedRows.map(r => r.chapter_id);
          const done = completedChapters.length;
          const percent = total > 0 ? Math.round((done / total) * 100) : 0;

          res.json({
            percent,
            total,
            completed: done,
            completedChapters
          });
        }
      );
    }
  );
};

// 📊 Toutes les progressions d'un étudiant (dashboard)
exports.getAllProgress = (req, res) => {
  const studentId = req.userId;

  db.query(
    `SELECT
       c.id as course_id,
       c.title,
       COALESCE(e.progress, 0) as progress,
       COUNT(DISTINCT ch.id) as total_chapters,
       COUNT(DISTINCT cp.id) as completed_chapters
     FROM enrollments e
     JOIN courses c ON c.id = e.course_id
     LEFT JOIN chapters ch ON ch.course_id = c.id
     LEFT JOIN chapter_progress cp
       ON cp.chapter_id = ch.id AND cp.student_id = e.student_id
     WHERE e.student_id = ?
     GROUP BY c.id, c.title, e.progress`,
    [studentId],
    (err, results) => {
      if (err) return res.status(500).json(err);
      // Toujours retourner un tableau
      res.json(Array.isArray(results) ? results : []);
    }
  );
};