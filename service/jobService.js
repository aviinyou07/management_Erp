const pool = require("../config/db");
const { getPostedText } = require("../utils/timeHelper");

async function getJobCards(page, limit) {
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    `SELECT * FROM jobs
     WHERE status = 'active'
     ORDER BY posted_at DESC
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  const jobs = rows.map((job) => {
    let badges = [];

    if (Array.isArray(job.badges)) {
      badges = job.badges;
    } else if (typeof job.badges === "string") {
      try {
        badges = JSON.parse(job.badges);
      } catch (error) {
        badges = [];
      }
    }

    return {
      id: job.id,
      title: job.title,
      company_name: job.company_name,
      company_initials: job.company_initials,
      location_text: job.location_text,
      badges: badges,
      posted_text: getPostedText(job.posted_at),
      applications_count: job.applications_count
    };
  });

  return jobs;
}

async function getJobById(id) {
  const [rows] = await pool.query(
    `SELECT * FROM jobs WHERE id = ? AND status = 'active' LIMIT 1`,
    [id]
  );

  if (rows.length === 0) {
    return null;
  }

  const job = rows[0];

  let supportFeatures = [];
  let responsibilities = [];
  let requiredSkills = [];

  try {
    supportFeatures = Array.isArray(job.support_features)
      ? job.support_features
      : JSON.parse(job.support_features || "[]");
  } catch (error) {
    supportFeatures = [];
  }

  try {
    responsibilities = Array.isArray(job.responsibilities)
      ? job.responsibilities
      : JSON.parse(job.responsibilities || "[]");
  } catch (error) {
    responsibilities = [];
  }

  try {
    requiredSkills = Array.isArray(job.required_skills)
      ? job.required_skills
      : JSON.parse(job.required_skills || "[]");
  } catch (error) {
    requiredSkills = [];
  }

  return {
    id: job.id,
    title: job.title,
    company_name: job.company_name,
    company_initials: job.company_initials,
    company_logo: job.company_logo,
    location_text: job.location_text,
    posted_text: getPostedText(job.posted_at),
    employment_type: job.employment_type,
    employees_count_text: job.employees_count_text,
    nri_preferred: Boolean(job.nri_preferred),
    apply_method: job.apply_method,
    is_actively_recruiting: Boolean(job.is_actively_recruiting),
    support_features: supportFeatures,
    about_role: job.about_role,
    responsibilities: responsibilities,
    required_skills: requiredSkills
  };
}


module.exports = { getJobCards,getJobById };