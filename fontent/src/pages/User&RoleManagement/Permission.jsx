import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import "./User.css";
import {
  getToken,
  isAuthenticated,
} from "../../utils/auth";



const API_BASE =
  "http://127.0.0.1:8000/api";


const ACTIONS = [
  {
    key: "view",
    label: "View",
    icon: "👁",
    color: "blue",
  },
  {
    key: "create",
    label: "Create",
    icon: "+",
    color: "green",
  },
  {
    key: "edit",
    label: "Edit",
    icon: "✎",
    color: "purple",
  },
  {
    key: "delete",
    label: "Delete",
    icon: "🗑",
    color: "red",
  },
  {
    key: "approve",
    label: "Approve",
    icon: "✓",
    color: "orange",
  },
  {
    key: "export",
    label: "Export",
    icon: "↓",
    color: "blue",
  },
];


const getDefaultActions = () => ({
  view: false,
  create: false,
  edit: false,
  delete: false,
  approve: false,
  export: false,
});


const normalizeModule = (moduleItem) => {
  // Backend may return string:
  //
  // "Employees"
  //

  if (typeof moduleItem === "string") {
    return {
      module: moduleItem,
      actions: getDefaultActions(),
    };
  }

  
  return {
    module: moduleItem?.module || "",
    actions: {
      ...getDefaultActions(),
      ...(moduleItem?.actions || {}),
    },
  };
};

export default function Permissions() {
  const navigate = useNavigate();


  const [permissions, setPermissions] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [expanded, setExpanded] =
    useState({});

  const [loading, setLoading] =
    useState(true);


  const loadPermissions = async () => {
    try {
      setLoading(true);

     const token = getToken();

const response = await fetch(
  "http://127.0.0.1:8000/api/permissions",
  {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }
);

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load permissions"
        );
      }


      let apiPermissions = [];

      if (
        Array.isArray(
          data.permissions
        )
      ) {
        apiPermissions =
          data.permissions;

      } else if (
        Array.isArray(data.data)
      ) {
        apiPermissions =
          data.data;

      } else if (
        Array.isArray(data)
      ) {
        apiPermissions = data;
      }


      const formattedPermissions =
        apiPermissions.map(
          (permission) => {

            const rawModules =
              Array.isArray(
                permission.modules
              )
                ? permission.modules
                : [];

            const modules =
              rawModules
                .map(
                  normalizeModule
                )
                .filter(
                  (item) =>
                    item.module
                );

            return {
              id:
                permission.id,

              permissionName:
                permission.permissionName ??
                permission.name ??
                "",

              description:
                permission.description ??
                "",

              status:
                permission.status ??
                "Active",

              roleName:
                permission.role_name ??
                permission.roleName ??
                permission.role?.name ??
                "",

              modules,
            };
          }
        );

      setPermissions(
        formattedPermissions
      );

    } catch (error) {
      console.error(
        "Permission loading error:",
        error
      );

      setPermissions([]);

    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadPermissions();
  }, []);


  useEffect(() => {
    const handleFocus = () => {
      loadPermissions();
    };

    window.addEventListener(
      "focus",
      handleFocus
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus
      );
    };
  }, []);


  const filteredPermissions =
    useMemo(() => {

      const searchValue =
        search
          .trim()
          .toLowerCase();

      return permissions.filter(
        (permission) => {


          const matchesPermissionName =
            permission.permissionName
              ?.toLowerCase()
              .includes(
                searchValue
              );


          const matchesDescription =
            permission.description
              ?.toLowerCase()
              .includes(
                searchValue
              );


          const matchesModule =
            permission.modules?.some(
              (module) =>
                module.module
                  ?.toLowerCase()
                  .includes(
                    searchValue
                  )
            );


          const matchesAction =
            permission.modules?.some(
              (module) =>
                ACTIONS.some(
                  (action) =>
                    module.actions?.[
                      action.key
                    ] &&
                    action.label
                      .toLowerCase()
                      .includes(
                        searchValue
                      )
                )
            );

          const matchesSearch =
            !searchValue ||
            matchesPermissionName ||
            matchesDescription ||
            matchesModule ||
            matchesAction;


          const matchesStatus =
            statusFilter === "All" ||
            permission.status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );

    }, [
      permissions,
      search,
      statusFilter,
    ]);


  const toggleExpand = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const data = {};

    filteredPermissions.forEach(
      (permission) => {
        data[permission.id] =
          true;
      }
    );

    setExpanded(data);
  };

 
  const collapseAll = () => {
    setExpanded({});
  };

  
  const totalModules =
    permissions.reduce(
      (total, permission) =>
        total +
        (permission.modules
          ?.length || 0),
      0
    );

 
  const totalActions =
    permissions.reduce(
      (total, permission) => {

        const permissionActions =
          (
            permission.modules ||
            []
          ).reduce(
            (
              moduleTotal,
              module
            ) => {

              const actions =
                module.actions ||
                {};

              const count =
                ACTIONS.filter(
                  (action) =>
                    !!actions[
                      action.key
                    ]
                ).length;

              return (
                moduleTotal +
                count
              );
            },
            0
          );

        return (
          total +
          permissionActions
        );
      },
      0
    );


  const activePermissions =
    permissions.filter(
      (permission) =>
        permission.status ===
        "Active"
    ).length;

const deletePermission = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this permission?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
    const token = getToken();

    if (!token) {
      throw new Error("Unauthenticated. Please log in again.");
    }

    const response = await fetch(
      `${API_BASE}/permissions/${id}`,
      {
        method: "DELETE",

        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    let data = {};

    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      throw new Error(
        data.message ||
          data.error ||
          "Unable to delete permission"
      );
    }

    // Remove from UI
    setPermissions((prev) =>
      prev.filter(
        (permission) => permission.id !== id
      )
    );

    // Remove expanded state
    setExpanded((prev) => {
      const updated = {
        ...prev,
      };

      delete updated[id];

      return updated;
    });

    alert("Permission deleted successfully.");
  } catch (error) {
    console.error(
      "Permission delete error:",
      error
    );

    alert(
      error.message ||
        "Unable to delete permission"
    );
  }
};


  return (
    <div className="permissions-page">


      <div className="page-header">

        <div>

          <h1>
            Permissions
          </h1>

          <p>
            Manage permissions, modules
            and available actions.
          </p>

        </div>

        <button
          className="primary-btn"
          type="button"
          onClick={() =>
            navigate(
              "/permissions/add"
            )
          }
        >
          + Add Permission
        </button>

      </div>



      <div className="permission-stats">

        <div>
          <span>
            Total Permissions
          </span>

          <strong>
            {permissions.length}
          </strong>
        </div>


        <div>
          <span>
            Total Modules
          </span>

          <strong>
            {totalModules}
          </strong>
        </div>


        <div>
          <span>
            Total Actions
          </span>

          <strong>
            {totalActions}
          </strong>
        </div>


        <div>
          <span>
            Active
          </span>

          <strong>
            {activePermissions}
          </strong>
        </div>

      </div>



      <div className="permission-toolbar">

        {/* SEARCH */}

        <div className="permission-search">

          <span>
            🔍
          </span>

          <input
            type="text"
            placeholder="Search permission or module..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>


        {/* STATUS */}

        <select
          className="permission-status-filter"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
        >

          <option value="All">
            All Status
          </option>

          <option value="Active">
            Active
          </option>

          <option value="Inactive">
            Inactive
          </option>

        </select>


        

        <div className="permission-toolbar-actions">

          <button
            type="button"
            className="select-all-btn"
            onClick={expandAll}
          >
            Expand All
          </button>

          <button
            type="button"
            className="clear-btn"
            onClick={collapseAll}
          >
            Collapse All
          </button>

        </div>

      </div>



      <div className="permission-container">


        {loading ? (

          <div className="permission-empty">

            <div className="permission-empty-icon">
              🔐
            </div>

            <h3>
              Loading permissions...
            </h3>

            <p>
              Please wait while permissions
              are being loaded.
            </p>

          </div>

        ) : filteredPermissions.length === 0 ? (


          <div className="permission-empty">

            <div className="permission-empty-icon">
              🔐
            </div>

            <h3>
              No permissions found
            </h3>

            <p>
              Click "Add Permission" to
              create your first permission.
            </p>

          </div>

        ) : (


          filteredPermissions.map(
            (permission) => {

              const isExpanded =
                !!expanded[
                  permission.id
                ];


              const permissionActionCount =
                (
                  permission.modules ||
                  []
                ).reduce(
                  (
                    total,
                    module
                  ) =>
                    total +
                    ACTIONS.filter(
                      (action) =>
                        !!module.actions?.[
                          action.key
                        ]
                    ).length,
                  0
                );

              return (

                <div
                  className="permission-group"
                  key={
                    permission.id
                  }
                >

                  <div
                    className="permission-group-header"
                    onClick={() =>
                      toggleExpand(
                        permission.id
                      )
                    }
                  >

                    {/* LEFT */}

                    <div className="permission-header-left">

                      <div className="module-icon">
                        🔐
                      </div>

                      <div>

                        <div className="permission-title-row">

                          <h3>
                            {
                              permission.permissionName
                            }
                          </h3>

                          <span
                            className={`permission-status ${
                              permission.status
                                ?.toLowerCase()
                            }`}
                          >
                            {
                              permission.status
                            }
                          </span>

                        </div>


                        {/* DESCRIPTION */}

                        <p className="permission-description">
                          {
                            permission.description
                          }
                        </p>


                        {/* META */}

                        <div className="permission-meta">

                          <span>
                            📦{" "}
                            {
                              permission
                                .modules
                                ?.length ||
                              0
                            }{" "}
                            Modules
                          </span>

                          <span>
                            ⚙️{" "}
                            {
                              permissionActionCount
                            }{" "}
                            Actions
                          </span>

                        </div>

                      </div>

                    </div>


                    {/* RIGHT */}

                    <div className="permission-header-right">

                      

                      <button
                        type="button"
                        className="permission-edit-btn"
                        title="Edit Permission"
                        onClick={(e) => {

                          e.stopPropagation();

                          navigate(
                            `/permissions/edit/${permission.id}`
                          );

                        }}
                      >
                        ✎
                      </button>


                      

                      <button
                        type="button"
                        className="permission-delete-btn"
                        title="Delete Permission"
                        onClick={(e) => {

                          e.stopPropagation();

                          deletePermission(
                            permission.id
                          );

                        }}
                      >
                        🗑
                      </button>


                      

                      <button
                        type="button"
                        className="permission-expand-btn"
                        title={
                          isExpanded
                            ? "Collapse"
                            : "Expand"
                        }
                        onClick={(e) => {

                          e.stopPropagation();

                          toggleExpand(
                            permission.id
                          );

                        }}
                      >

                        {isExpanded
                          ? "▲"
                          : "▼"}

                      </button>

                    </div>

                  </div>



                  {isExpanded && (

                    <div className="permission-list">

                      {permission.modules?.length > 0 ? (

                        permission.modules.map(
                          (
                            moduleItem,
                            index
                          ) => {

                            const moduleName =
                              moduleItem.module;

                            const actions =
                              moduleItem.actions ||
                              getDefaultActions();


                            const enabledActions =
                              ACTIONS.filter(
                                (action) =>
                                  !!actions[
                                    action.key
                                  ]
                              );

                            return (

                              <div
                                className="permission-module-row"
                                key={`${moduleName}-${index}`}
                              >


                                <div className="permission-module-info">

                                  <div className="permission-module-icon">
                                    📁
                                  </div>

                                  <div>

                                    <strong>
                                      {
                                        moduleName
                                      }
                                    </strong>

                                    <span>
                                      {
                                        enabledActions.length
                                      }{" "}
                                      of{" "}
                                      {
                                        ACTIONS.length
                                      }{" "}
                                      actions enabled
                                    </span>

                                  </div>

                                </div>



                                <div className="module-actions">

                                  {ACTIONS.map(
                                    (
                                      action
                                    ) => {

                                      const enabled =
                                        !!actions[
                                          action.key
                                        ];

                                      return (

                                        <div
                                          key={
                                            action.key
                                          }
                                          className={`module-action-badge ${
                                            enabled
                                              ? "enabled"
                                              : "disabled"
                                          }`}
                                        >

                                        

                                          <span
                                            className={`module-action-icon ${action.color}`}
                                          >
                                            {
                                              action.icon
                                            }
                                          </span>


                                          

                                          <span>
                                            {
                                              action.label
                                            }
                                          </span>


                                         

                                          <span className="action-check">

                                            {enabled
                                              ? "✓"
                                              : "—"}

                                          </span>

                                        </div>

                                      );

                                    }
                                  )}

                                </div>

                              </div>

                            );

                          }
                        )

                      ) : (

                        <div className="permission-no-modules">

                          No modules assigned to
                          this permission.

                        </div>

                      )}

                    </div>

                  )}

                </div>

              );

            }
          )

        )}

      </div>

    </div>
  );
}
