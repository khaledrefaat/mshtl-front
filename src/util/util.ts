export const convertDate = (date: string) => {
  const convertedDate = new Date(date);
  const yyyy = convertedDate.getFullYear();
  let mm = convertedDate.getMonth() + 1;
  let dd = convertedDate.getDate();

  return dd + '/' + mm + '/' + yyyy;
};

export const filterByName = (
  term: string,
  arrData: any,
  searchByItemName?: boolean
) => {
  if (searchByItemName)
    return arrData.filter(
      (data: any) => data.itemName && data.itemName.includes(term)
    );
  return arrData.filter((data: any) => data.name && data.name.includes(term));
};

export const navList = [
  {
    to: '/',
    body: 'يوميات مبيعات',
    id: 62,
  },
  {
    to: '/order-seeds',
    body: 'حجز شتلات',
    id: 26,
  },
  {
    to: '/item',
    body: 'الاصناف مشتل',
    id: 67,
  },
  {
    to: '/trays',
    body: 'صواني',
    id: 100,
  },
  {
    to: '/planting-notebook',
    body: 'دفتر زراعة',
    id: 5,
  },
  {
    to: '/customers',
    body: 'عملاء',
    id: 22,
  },
  {
    to: '/suppliers',
    body: 'موردين',
    id: 57,
  },
  {
    to: '/fixed-salary',
    body: 'اجور ثابتة',
    id: 18,
  },
  {
    to: '/employment',
    body: 'عمالة',
    id: 99,
  },
  {
    to: '/hospitality',
    body: 'ضيافة',
    id: 94,
  },
  {
    to: '/electricity',
    body: 'كهرباء',
    id: 33,
  },
  {
    to: '/water',
    body: 'مياه',
    id: 169,
  },
  {
    to: '/gas',
    body: 'بنزين',
    id: 53,
  },
  {
    to: '/requirements',
    body: 'مستلزمات',
    id: 30,
  },
  {
    to: '/fertilizer',
    body: 'اسمدة',
    id: 4,
  },
  {
    to: '/loan',
    body: 'سلفة',
    id: 201,
  },
];

export const returnUrl = (
  name: string,
  subName: string | null,
  _id: string,
  transactionId?: string
) => {
  const deleteData = [
    {
      name: 'Customer',
      subName: 'Fertilizer',
      url: `${
        import.meta.env.VITE_URI
      }/customer/fertilizer/${_id}/${transactionId}`,
    },
    {
      name: 'Customer',
      subName: 'Item',
      url: `${import.meta.env.VITE_URI}/customer/item/${_id}/${transactionId}`,
    },
    {
      name: 'Customer',
      url: `${import.meta.env.VITE_URI}/customer/${_id}/${transactionId}`,
    },
    {
      name: 'Fertilizer',
      subName: 'Data',
      url: `${import.meta.env.VITE_URI}/fertilizer/${_id}/${transactionId}`,
    },
    {
      name: 'Seeding',
      url: `${import.meta.env.VITE_URI}/seed/${_id}`,
    },
    {
      name: 'Item',
      subName: 'Order',
      url: `${import.meta.env.VITE_URI}/item/order/${_id}/${transactionId}`,
    },
    {
      name: 'Item',
      subName: 'Data',
      url: `${import.meta.env.VITE_URI}/item/${_id}/${transactionId}`,
    },
    {
      name: 'Supplier',
      subName: 'fertilizerTransaction',
      url: `${import.meta.env.VITE_URI}/supplier/${_id}/${transactionId}`,
    },
    {
      name: 'Supplier',
      url: `${import.meta.env.VITE_URI}/supplier/${_id}/${transactionId}`,
    },
    {
      name: 'Tray',
      url: `${import.meta.env.VITE_URI}/tray/${_id}`,
    },
    {
      name: 'FixedSalary',
      url: `${import.meta.env.VITE_URI}/fixed-salary/${_id}`,
    },
    {
      name: 'Employment',
      url: `${import.meta.env.VITE_URI}/employment/${_id}`,
    },
    {
      name: 'Hospitality',
      url: `${import.meta.env.VITE_URI}/hospitality/${_id}`,
    },
    {
      name: 'Gas',
      url: `${import.meta.env.VITE_URI}/gas/${_id}`,
    },
    {
      name: 'Electricity',
      url: `${import.meta.env.VITE_URI}/electricity/${_id}`,
    },
    {
      name: 'Water',
      url: `${import.meta.env.VITE_URI}/water/${_id}`,
    },
    {
      name: 'Requirements',
      url: `${import.meta.env.VITE_URI}/requirements/${_id}`,
    },
    {
      name: 'Forks',
      url: `${import.meta.env.VITE_URI}/forks/${_id}`,
    },
    {
      name: 'Loan',
      url: `${import.meta.env.VITE_URI}/loan/${_id}/${transactionId}`,
    },
  ];

  for (let data of deleteData) {
    if (name === data.name && subName === data.subName) return data.url;
    else if (name === data.name && subName === null && !data.subName)
      return data.url;
  }
};

export const monthList: { [month: string]: string } = {
  January: 'يناير',
  February: 'فبراير',
  March: 'مارس',
  April: 'أبريل',
  May: 'مايو',
  June: 'يونيو',
  July: 'يوليو',
  August: 'أغسطس',
  September: 'سبتمبر',
  October: 'أكتوبر',
  November: 'نوفمبر',
  December: 'ديسمبر',
};
