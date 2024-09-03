const header = {
  uz: "uz",
  ru: "ru",
  en: "en",
  action: "actions",
  create: "create",
  delete: "delete",
  update: "edit",
  basket: "Basket",
  transfer: "Transfer",
  continue: "confirm",
  login: {
    welcome: "Welcome to TMA",
    title: "Login",
    password: "Password",
    enter: "login",
    wrongpassword: "Incorrect username or password! Please try again"
  },
  alerts: {
    password_incorrect: "Password is incorrect: it must contain at least one uppercase letter, a special character, and a number, and be between 6 and 30 characters long",
    confirmdelete: "Are you sure you want to delete?",
    ok: "OK",
    no: "Cancel",
    inputError: "Do not leave fields empty",
    nodelete: "No permission",
    deleted: "Successfully deleted",
    added: "Successfully created",
    edited: "Successfully edited",
    slownetwork: "Internet is slow or not available",
    warning: "Something went wrong, please try again"
  },
  sidebar: {
    category: "Category",
    reviews: "Buildings",
    admins: "Administrators",
    news: "News",
    type: "type",
    exit: "Logout",
    role: "role"
  },
  home: {
    start_time: "start time",
    end_time: "end time",
    budget: "budget",
    clients: "clients",
    total_profit: "total profit",
    expenses: "expenses"
  },
  table: {
    grafik: "chart",
    open_hour: "opening time",
    close_hour: "closing time",
    address: "address",
    datefrom: (s, e) => `${s} to ${e}`,
    fuel_type: "fuel type",
    max_speed: "maximum speed",
    place: "place",
    tinting: "tinting",
    baggage: "baggage",
    conditioner: "air conditioning",
    false: "not available",
    true: "available",
    lang: "language",
    star: "star",
    from: "from",
    ordered: "ordered",
    moving_from_country: "moving from country",
    entered_to_country: "entered to country",
    delivered: "delivered",
    creator: "creator",
    types: "view filter",
    all: "all",
    by_category: "by category",
    by_client: "by client",
    by_fesclient: "by FES client",
    complated: "completed",
    active: "active",
    kurs: "course",
    card: "card",
    cash: "cash",
    delivery: "delivery",
    pickup: "pickup",
    inactive: "inactive",
    payment_method: "payment method",
    shipment_id: "shipment ID",
    custom_date: "custom time",
    residual_amount: "residual amount",
    complated_amount: "detailed description",
    image: "image",
    exist: "exists",
    deliver_name: "deliverer's name",
    deliver_phone: "deliverer's phone",
    truck_number: "truck number",
    add_shipment: "Add Shipment",
    name: "Name",
    sale: "sale",
    title: "title",
    sale_cost: "sale price",
    sale_amount: "discount percentage",
    subtitle: "subtitle",
    info: "information",
    created_at: "created at",
    amount: "amount",
    overall_price: "Total Price",
    payed_price: "paid part",
    status: "status",
    country: "Country",
    country_number: "order number",
    id: "ID",
    inn: "INN",
    total_amount: "total amount",
    type: "Car Type",
    car_name: "Car Name",
    method: "method",
    uses_date: "date of use",
    seria_id: "serial number",
    sum: "Amount",
    dollar: "in currency",
    stock_id: "warehouse ID",
    price: "price",
    client_id: "client ID",
    new_price: "new price",
    direction: "direction",
    product_name: "product name",
    client_name: "client name",
    client_number: "client number",
    phone_number: "phone number",
    additional_info: "additional information",
    expenses_name: "expenses name",
    rows_per_page: "Rows per page",
    date: "date",
    status: "status",
    direction: "direction",
    rejected: "rejected",
    accepted: "accepted",
    reject: "reject",
    accept: "accept",
    pending: "pending",
    warehouse: "Warehouse",
    employee: "employee",
    location: "location"
  },
  modal: {
    add: "Add",
    edit: "Edit",
    addProduct: {
      addproduct: "Add Product",
      editproduct: "Edit Product",
      count: "quantity",
      kg: "kg",
      liter: "liter",
      meter: "meter",
      sale: "sale",
      addtocart: "Add to Cart",
      sale_product: "Sell Product",
      total_price: "Total Price"
    },
    addAdmins: {
      adddeliver: "Add Admin",
      editdeliver: "Edit Admin"
    },
    addNews: {
      addNews: "Add News",
      editNews: "Edit News"
    },
    addBuilding: {
      addbuilding: "Add Building",
      editbuilding: "Edit Building"
    },
    addWarehouse: {
      title: "Add Brand",
      edit: "Edit Brand",
      transfer_from_werhouse: "Transfer from Main Warehouse",
      transfer_to_werhouse: "Transfer between Warehouses"
    },
    addExpenses: {
      title: "Add Expenses",
      edit: "Edit Expenses"
    },
    addIncome: {
      title: "Add Income",
      edit: "Edit Income"
    },
    addCategory: {
      title: "Add Category",
      edit: "Edit Category",
      category: "Category",
      subcategory: "Subcategory",
      subtitle: "Add Subcategory",
      subedit: "Edit Subcategory"
    },
    addCompany: {
      title: "Add Company",
      edit: "Edit Company",
      category: "Company",
      subcategory: "account number",
      subtitle: "Add Company Account",
      subedit: "Edit Company Account"
    }
  }
};

export default header;
