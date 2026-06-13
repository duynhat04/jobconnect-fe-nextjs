const PROFILE_FIELDS = [
  {
    key: "fullName",
    label: "Họ và tên",
    group: "personal",
  },
  {
    key: "email",
    label: "Email",
    group: "personal",
  },
  {
    key: "phone",
    label: "Số điện thoại",
    group: "personal",
  },
  {
    key: "address",
    label: "Địa chỉ",
    group: "personal",
  },
  {
    key: "skills",
    label: "Kỹ năng",
    group: "skill",
  },
  {
    key: "desiredPosition",
    label: "Vị trí mong muốn",
    group: "skill",
  },
  {
    key: "desiredCategory",
    label: "Ngành nghề mong muốn",
    group: "skill",
  },
  {
    key: "experienceYears",
    label: "Kinh nghiệm",
    group: "skill",
  },
  {
    key: "expectedSalary",
    label: "Mức lương mong muốn",
    group: "skill",
  },
  {
    key: "educationLevel",
    label: "Trình độ học vấn",
    group: "skill",
  },
  {
    key: "englishLevel",
    label: "Trình độ tiếng Anh",
    group: "skill",
  },
  {
    key: "cvUrl",
    label: "CV ứng tuyển",
    group: "cv",
  },
];

const hasValue = (value) => {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === "number") {
    return !Number.isNaN(value);
  }

  if (typeof value === "boolean") {
    return value;
  }

  return String(value).trim().length > 0;
};

export const getProfileCompletionFields = (user) => {
  if (!user) {
    return PROFILE_FIELDS.map((field) => ({
      ...field,
      completed: false,
      value: null,
    }));
  }

  return PROFILE_FIELDS.map((field) => {
    const value = user?.[field.key];

    return {
      ...field,
      value,
      completed: hasValue(value),
    };
  });
};

export const calculateProfilePercent = (user) => {
  const fields = getProfileCompletionFields(user);

  if (fields.length === 0) {
    return 0;
  }

  const completed = fields.filter((field) => field.completed).length;

  return Math.round((completed / fields.length) * 100);
};

export const getCompletedProfileCount = (user) => {
  return getProfileCompletionFields(user).filter((field) => field.completed)
    .length;
};

export const getTotalProfileFieldCount = () => {
  return PROFILE_FIELDS.length;
};

export const getMissingProfileFields = (user) => {
  return getProfileCompletionFields(user).filter((field) => !field.completed);
};

export const getProfileStatus = (user) => {
  const fields = getProfileCompletionFields(user);

  const personalFields = fields.filter((field) => field.group === "personal");
  const skillFields = fields.filter((field) => field.group === "skill");
  const cvFields = fields.filter((field) => field.group === "cv");

  const hasPersonalInfo = personalFields.every((field) => field.completed);

  const hasSkillInfo = skillFields.some((field) => field.completed);

  const hasCv = cvFields.every((field) => field.completed);

  return {
    personal: hasPersonalInfo ? "Đã có" : "Cần cập nhật",
    personalClass: hasPersonalInfo ? "text-emerald-600" : "text-amber-600",
    personalCompleted: hasPersonalInfo,

    skill: hasSkillInfo ? "Đã có" : "Cần cập nhật",
    skillClass: hasSkillInfo ? "text-emerald-600" : "text-amber-600",
    skillCompleted: hasSkillInfo,

    cv: hasCv ? "Đã có" : "Quan trọng",
    cvClass: hasCv ? "text-emerald-600" : "text-orange-600",
    cvCompleted: hasCv,
  };
};

export const getProfileRowStatus = (user) => {
  return getProfileStatus(user);
};

export const getProfileCompletionSummary = (user) => {
  const percent = calculateProfilePercent(user);
  const completed = getCompletedProfileCount(user);
  const total = getTotalProfileFieldCount();
  const missingFields = getMissingProfileFields(user);

  return {
    percent,
    completed,
    total,
    missingFields,
    status: getProfileStatus(user),
  };
};