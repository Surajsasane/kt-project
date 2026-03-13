import React from "react";

export default function EmployeeTabs({ selectedEmployee, setSelectedEmployee }) {
  const employees = ["Employee1", "Employee2", "Employee3", "Employee4"];

  return (
    <div className="tabs">
      {employees.map((emp) => (
        <button
          key={emp}
          className={selectedEmployee === emp ? "active-tab" : ""}
          onClick={() => setSelectedEmployee(emp)}
        >
          {emp}
        </button>
      ))}
    </div>
  );
}