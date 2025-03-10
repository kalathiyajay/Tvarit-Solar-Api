const express = require('express');
const auth = require('../helper/auth');
const axios = require('axios');
const indexRoutes = express.Router();
const upload = require('../helper/imageUplode');
const { userlogin, changePassword, userLogout, refreshToken, checkD, checkAuth, generateNewTokens } = require('../auth/auth');
const { createNewProduct, getAllProductData, getProductById, updateProductData, deleteProductData } = require('../controller/product.controller');
const { createCategory, getAllCategory, getCategoryById, updateCategory, deleteCategory } = require('../controller/category.controller');
const { createSubCategory, getAllSubCategory, getSubCategoryById, updateSubCategory, deleteSubCategory } = require('../controller/subCategory.controller');
const { createRole, getAllRoles, getRoleById, upadetRoleById, deleteRoleById } = require('../controller/role.controller');
const { createNewUser, getAllUsers, getUserById, updateUser, removeUser } = require('../controller/user.controller');
const { createWareHouse, getAllWareHouse, getWareHouseById, updateWareHouseById, deleteWareHouseById, getAllWarehouseUser } = require('../controller/warehouse.controllle');
const { createKitProduct, getAllKitProduct, updateKitProductById, deleteKitProductById, getkitProductById, deleteKitDetilaById, getAllKitsProductData, getAllKitSubCategoryData, getAllKitCategoryData } = require('../controller/kitproduct.controller');
const { createNewVendor, getAllvendor, getvendorById, updateVandor, removeVendor } = require('../controller/vendor.controller');
const { createDealer, getAllDealers, getDealerById, updateDealer, deleteDealer, updateDealerStatus, dealerCommissionStatus, dealerPaymentStatus, updateBoxStatus, getAllSolarModulAndInveterProducts } = require('../controller/dealerEntery.controller');
const { createAccount, getAllAccount, getAccountById, updateAccount, deleteAccount, getAllMarketingData } = require('../controller/account.controller');
const { createLiasoning, getAllLiasoning, getLiasoningById, updateLiasoning, deleteLiasoning, updateLiasoningStatus } = require('../controller/liasoning.controller');
const { createcommercialMarket, getAllCommercialmarket, getCommercialMarketById, updateCommercialMarket, deleteCommercialMasrket, getAllWarehouse, getAllCommercialProduct, getAllCommercialDealer, getAllDealerProduct, getAllPendingDealerData } = require('../controller/commercialMarket.controller');
const { createNewPurchase, getAllPurchaseData, getPurchaseById, updatePurchaseData, deletePurchase, deletePurchaseDetailsById, getAllPurchaseWarehouse, getAllPurchaseProduct, getAllPurchaseVendor, getAllTermsAndCondition } = require('../controller/purchase.controller');
const { createTrasportDetaile, getAllTransportDetails, getTransportByID, updateTransportDetails, deleteTransportDetails } = require('../controller/transport.controller');
const { createSlideBarCategory, getAllSlideBarCategory, getSlideBarCategory, updateSlideBarCategory, deleteSlidBarCategory, slideBarCategory, getAllSlideBarCategoryByAdmin } = require('../controller/slideBarCategory.Controller');
const { createConditions, getAllConditions, getConditionById, updateConditionById, deleteConditionById } = require('../controller/termsAndConditionsController');
const { createstore, getAllstore, getstore, getstoreById, updatestoreById, deletestoreById, getAllstoreItems, getWarhouseData, transferStore, getstoreProduct, getstorepurchase, getstorewarehouse, getstoreUsers } = require('../controller/store.controller');
const { createDealerPayment, getAllDealerPayment, getDealerPaymentById, updateDealerPayment, deleteDealerPayment, getAllDealersData } = require('../controller/DealerPayment.controller');
const { createVendorPayment, getAllVendorPayment, getVendorPaymentById, updateVendorPayment, deleteVendorPayment, getAllPaymentVendor } = require('../controller/VendorPayment.controller');
const { createNewstocktransfer, getAllstocktransferData, getstocktransferById, updateStocktransferData, deleteStocktransferData, getAllStoreTransferCategoryData, getAllStoreTransferSubCategoryData, getAllStoreTransferProductData, getAllStoreTransferWarehouseData, getstorestock } = require('../controller/stocktransfer.controller');
const { createDispatchSuggestion, getAllDispatchSuggestion, getDispatchSuggestionById, updateDispatchSuggestionById, deleteDispatchSuggestionById, deleteDispatchDetailsById, getAllDispatchSuggestionProductData, getAllDispatchSuggestionSubCategoryData, getAllDispatchSuggestionCategoryData } = require('../controller/dispatchsuggestion.controller');
const { createDispatchProcess, getAllDispatchProcess, getDispatchProcessById, updateDispatchProcessById, deleteDispatchProcessById, getDispatchSuggestionId, deleteProcessDispatchDetailsById, getAllDispatchProcessCategoryData, getAllDispatchProcessSubCategoryData, getAllDispatchProcessProductData, getAllDispatchProcesslWarehouseData, getprocessSuggestion, getprocesskitproduct, getAllDispatchProcessByWarehouse, getAllDataForCommercialmarket } = require('../controller/dispatchProcess.controller');
const { createAssignInstaller, getAllAssignInstaller, getAssignInstallerById, updateAssignInstaller, deleteAssignInstaller, getAllLiaoningData, getFabricator, getElectrician, getTechnician, getUserinAssign } = require('../controller/assign.controller');
const { createFabricator, getAllFabricator, getFabricatorById, updateFabricator, deleteFabricator, updateFabricatorStatus, getAssignInFab, getfabProduct, getfabSubCategory, getfabCategory, getfabUser } = require('../controller/fabricator.controller');
const { createElectrician, getElectricianById, updateElectrician, deleteElectrician, getAllElectrician, updateElectricianStatus, getAssignInEle, geteleCategory, geteleSubCategory, geteleProduct } = require('../controller/electrician.controller');
const { getAllTechnician, getTechnicianById, deleteTechnician, updateTechnician, createTechnician, updateTechnicianStatus, getAssignInTech, gettechCategory, gettechSubCategory, gettechProduct } = require('../controller/technician.controller');
const { createInstallerPayment, getAllInstallerPayment, getInstallerPaymentById, updateInstallerPayment, deleteInstallerPayment, getAllInstallerData, getAllDataFabricator, getAllDataElectrician, getAllDataTechnician } = require('../controller/InstallerPayment.controller');
const { createBom, getAllBom, getBomById, updateBomById, deleteBomById, getBomProduct, getBomSubCategory, getBomCategory, getBomstore } = require('../controller/bom.controller');
const { createSales, getAllSales, getSalesById, updateSalesById, deleteSalesById, updateSalesDetailsById, getsalesCategory, getsalesSubCategory, getsalesProduct, getsalesBom, getsalesTerms } = require('../controller/sales.controller');
const { piechart, linechart, getAggregatedData, getMarketBarChartData, marketingAndLiasoningLinechart, chartData, systemSizeLineChart, electricianMonthlyReport, fabricatorMonthlyReport, technicianMonthlyReport } = require('../controller/dashboard.controller');

// ------ All Rouutes ------

// Auth Routes 

indexRoutes.post('/login', userlogin);
indexRoutes.put('/changePassword/:id', auth(['Super Admin', 'Dealer', 'Electric11', 'warehouse']), changePassword);
indexRoutes.post('/logout/:id', userLogout);
indexRoutes.get('/checkAuth', checkAuth);
indexRoutes.post('/generateNewTokens', generateNewTokens);
indexRoutes.get('/checkD', checkD);

// Dashbaord Routes
indexRoutes.get('/aggregatedata', auth('Dashboard'), getAggregatedData);
indexRoutes.get('/piechart', auth('Dashboard'), piechart);
indexRoutes.get('/linechart', auth('Dashboard'), linechart);
indexRoutes.get('/getMarketBarChartData', auth('Dashboard'), getMarketBarChartData);
indexRoutes.get('/chartData', auth('Dashboard'), chartData)
indexRoutes.get('/marketingAndLiaosningChart', auth('Dashboard'), marketingAndLiasoningLinechart)
indexRoutes.get('/dealerDashboard', auth('Dashboard'), systemSizeLineChart)
indexRoutes.get('/fabricatorDashboard', auth('Dashboard'), fabricatorMonthlyReport)
indexRoutes.get('/electricionDashboard', auth('Dashboard'), electricianMonthlyReport)
indexRoutes.get('/technicianDashboard', auth('Dashboard'), technicianMonthlyReport)

// Stock Transfer Routes

indexRoutes.post('/createStocktransfer', auth('Dispatch'), createNewstocktransfer);
indexRoutes.get('/getAllStocktransfer', auth('Dispatch'), getAllstocktransferData);
indexRoutes.get('/getStocktransferById/:id', auth('Dispatch'), getstocktransferById);
indexRoutes.put('/updateStocktransfer/:id', auth('Dispatch'), updateStocktransferData);
indexRoutes.delete('/deleteStocktransfer/:id', auth('Dispatch'), deleteStocktransferData);
indexRoutes.get('/getstockCategory', auth('Dispatch'), getAllStoreTransferCategoryData);
indexRoutes.get('/getstockSubCategory', auth('Dispatch'), getAllStoreTransferSubCategoryData);
indexRoutes.get('/getstockProduct', auth('Dispatch'), getAllStoreTransferProductData);
indexRoutes.get('/getstockWarehouseUser', auth('Dispatch'), getAllStoreTransferWarehouseData);
indexRoutes.get('/getstockstore', auth('Dispatch'), getstorestock);

// Product Routes 

indexRoutes.post('/addNewProduct', auth('Products'), createNewProduct);
indexRoutes.get('/allproduct', auth('Products'), getAllProductData);
indexRoutes.get('/getProduct/:id', auth('Products'), getProductById);
indexRoutes.put('/updateProduct/:id', auth('Products'), updateProductData);
indexRoutes.delete('/deleteProduct/:id', auth('Products'), deleteProductData);

//Category Routes

indexRoutes.post('/addCategory', auth('Products'), createCategory);
indexRoutes.get('/allCategory', auth('Products'), getAllCategory);
indexRoutes.get('/getCategory/:id', auth('Products'), getCategoryById);
indexRoutes.put('/updateCategory/:id', auth('Products'), updateCategory);
indexRoutes.delete('/deleteCategory/:id', auth('Products'), deleteCategory);

//subCategory Routes

indexRoutes.post('/addSubCategory', auth('Products'), createSubCategory);
indexRoutes.get('/allSubCategory', auth('Products'), getAllSubCategory);
indexRoutes.get('/getSubCategory/:id', auth('Products'), getSubCategoryById);
indexRoutes.put('/updateSubCategory/:id', auth('Products'), updateSubCategory);
indexRoutes.delete('/deleteSubCategory/:id', auth('Products'), deleteSubCategory);

//roles Routes 

indexRoutes.post('/createRole', auth('Users'), createRole);
indexRoutes.get('/allRoles', auth('Users'), getAllRoles);
indexRoutes.get('/getRoleById/:id', auth('Users'), getRoleById);
indexRoutes.put('/updateRole/:id', auth('Users'), upadetRoleById);
indexRoutes.delete('/deleteRole/:id', auth('Users'), deleteRoleById);

// user Routes 

indexRoutes.post('/createUser', auth('Users'), upload.single('avatar'), createNewUser);
indexRoutes.get('/allUsers', auth('Users'), getAllUsers);
indexRoutes.get('/getUserById/:id', auth('Users'), getUserById);
indexRoutes.put('/userUpdate/:id', auth('Users'), upload.single('avatar'), updateUser);
indexRoutes.delete('/deleteUser/:id', auth('Users'), removeUser);

// wareHouse Routes

indexRoutes.post('/createWarehouse', auth('Warehouses'), createWareHouse);
indexRoutes.get('/getAllWarehouse', auth('Warehouses'), getAllWareHouse);
indexRoutes.get('/geWareHouseById/:id', auth('Warehouses'), getWareHouseById);
indexRoutes.put('/updateWareHouse/:id', auth('Warehouses'), updateWareHouseById);
indexRoutes.delete('/deleteWarehouse/:id', auth('Warehouses'), deleteWareHouseById);
indexRoutes.get('/getWarehouseUsers', auth('Warehouses'), getAllWarehouseUser);

//kitProduct Routes 

indexRoutes.post('/createKitProduct', auth('Dispatch'), createKitProduct);
indexRoutes.get('/getAllKitProduct', auth('Dispatch'), getAllKitProduct);
indexRoutes.get('/getKitProductById/:id', auth('Dispatch'), getkitProductById);
indexRoutes.put('/updateKitProduct/:id', auth('Dispatch'), updateKitProductById);
indexRoutes.delete('/deleteKitProduct/:id', auth('Dispatch'), deleteKitProductById);
indexRoutes.delete('/deteleKitDetails/:id', auth('Dispatch'), deleteKitDetilaById);
indexRoutes.get('/getListCategoryInKitProduct', auth('Dispatch'), getAllKitCategoryData);
indexRoutes.get('/getListSubCategoryInKitProduct', auth('Dispatch'), getAllKitSubCategoryData);
indexRoutes.get('/getListProductInKitProduct', auth('Dispatch'), getAllKitsProductData);

//Dispatch Suggestion Routes 

indexRoutes.post('/createDispatchSuggestion', auth('Dispatch'), createDispatchSuggestion);
indexRoutes.get('/getAllDispatchSuggestion', auth('Dispatch'), getAllDispatchSuggestion);
indexRoutes.get('/getDispatchSuggestionById/:id', auth('Dispatch'), getDispatchSuggestionById);
indexRoutes.put('/updateDispatchSuggestion/:id', auth('Dispatch'), updateDispatchSuggestionById);
indexRoutes.delete('/deleteDispatchSuggestion/:id', auth('Dispatch'), deleteDispatchSuggestionById);
indexRoutes.delete('/deleteDispatchDetails/:id', auth('Dispatch'), deleteDispatchDetailsById);
indexRoutes.get('/getListCategoryInDispatchSuggestion', auth('Dispatch'), getAllDispatchSuggestionCategoryData);
indexRoutes.get('/getListSubCategoryInDispatchSuggestion', auth('Dispatch'), getAllDispatchSuggestionSubCategoryData);
indexRoutes.get('/getListProductInDispatchSuggestion', auth('Dispatch'), getAllDispatchSuggestionProductData);

//Dispatch Process Routes 

indexRoutes.post('/createDispatchProcess', auth('Dispatch'), createDispatchProcess);
indexRoutes.get('/getAllDispatchProcess', auth('Dispatch'), getAllDispatchProcess);
indexRoutes.get('/getDispatchProcessById/:id', auth('Dispatch'), getDispatchProcessById);
indexRoutes.put('/updateDispatchProcess/:id', auth('Dispatch'), updateDispatchProcessById);
indexRoutes.delete('/deleteDispatchProcess/:id', auth('Dispatch'), deleteDispatchProcessById);
indexRoutes.get('/getDispatchSuggestionId/:id', auth('Dispatch'), getDispatchSuggestionId);
indexRoutes.delete('/deleteProcessDispatchDetails/:id', deleteProcessDispatchDetailsById);
indexRoutes.get('/getDispactProcessCategory', auth('Dispatch'), getAllDispatchProcessCategoryData)
indexRoutes.get('/getDispatchProcessSubCategory', auth('Dispatch'), getAllDispatchProcessSubCategoryData);
indexRoutes.get('/getDispatchProcessProduct', auth('Dispatch'), getAllDispatchProcessProductData);
indexRoutes.get('/getDispactProcessWarehouseUser', auth('Dispatch'), getAllDispatchProcesslWarehouseData);
indexRoutes.get('/getprocessSuggestion', auth('Dispatch'), getprocessSuggestion);
indexRoutes.get('/getDispatchProcessWarehouseData/:id', auth('Dispatch'), getAllDispatchProcessByWarehouse)
indexRoutes.get('/getprocesskitproduct', auth('Dispatch'), getprocesskitproduct);
indexRoutes.get('/getAllDataForCommercialmarket', auth('Dispatch'), getAllDataForCommercialmarket)

// vedor Routes

indexRoutes.post('/createVandore', auth('Vendors'), createNewVendor);
indexRoutes.get('/getAllVender', auth('Vendors'), getAllvendor);
indexRoutes.get('/getVenderbyId/:id', auth('Vendors'), getvendorById);
indexRoutes.put('/updateVenode/:id', auth('Vendors'), updateVandor);
indexRoutes.delete('/deleteVendor/:id', auth('Vendors'), removeVendor);

//  dealer Routes 

indexRoutes.post('/createDealer', auth('Dealer'), upload.fields([{ name: "dealerImage", maxCount: 50 }]), createDealer);
indexRoutes.get('/getAllDealer', auth('Dealer'), getAllDealers);
indexRoutes.get('/getDealerById/:id', auth('Dealer'), getDealerById);
indexRoutes.put('/updateDealer/:id', auth('Dealer'), upload.fields([{ name: "dealerImage", maxCount: 50 }, { name: "UploadPaymentSlip", maxCount: 50 }]), updateDealer);
indexRoutes.delete('/deleteDealer/:id', auth('Dealer'), deleteDealer)
indexRoutes.put('/updateDealerStatus/:id', auth('Dealer'), updateDealerStatus)
indexRoutes.put('/dealerCommissionStatus/:id', auth('Dealer'), dealerCommissionStatus)
indexRoutes.put('/dealerPaymentStatus/:id', auth('Dealer'), dealerPaymentStatus);
indexRoutes.put('/updateBoxStatus/:id', auth('Dealer'), updateBoxStatus);
indexRoutes.get('/getDealerProduct', auth('Dealer'), getAllSolarModulAndInveterProducts)

// Account Routes

indexRoutes.post('/createAccount', auth('Account'), createAccount);
indexRoutes.get('/getAllAccount', auth('Account'), getAllAccount);
indexRoutes.get('/getAccountById/:id', auth('Account'), getAccountById);
indexRoutes.put('/updateAccount/:id', auth('Account'), updateAccount);
indexRoutes.delete('/deleteAccount/:id', auth('Account'), deleteAccount);
indexRoutes.get('/getAllMarketingData', auth('Account'), getAllMarketingData)

// Dealer Payment Routes

indexRoutes.post('/createDealerPayment', auth('Account'), createDealerPayment);
indexRoutes.get('/getAllDealerPayment', auth('Account'), getAllDealerPayment);
indexRoutes.get('/getDealerPaymentById/:id', auth('Account'), getDealerPaymentById);
indexRoutes.put('/updateDealerPayment/:id', auth('Account'), updateDealerPayment);
indexRoutes.delete('/deleteDealerPayment/:id', auth('Account'), deleteDealerPayment);
indexRoutes.get('/getAllDealersData', auth('Account'), getAllDealersData);

// Installer Payment Routes

indexRoutes.post('/createInstallerPayment', auth('Account'), createInstallerPayment);
indexRoutes.get('/getAllInstallerPayment', auth('Account'), getAllInstallerPayment);
indexRoutes.get('/getInstallerPaymentById/:id', auth('Account'), getInstallerPaymentById);
indexRoutes.put('/updateInstallerPayment/:id', auth('Account'), updateInstallerPayment);
indexRoutes.delete('/deleteInstallerPayment/:id', auth('Account'), deleteInstallerPayment);
indexRoutes.get('/getAllInstallerData', auth('Account'), getAllInstallerData);
indexRoutes.get('/getAllDataFabricator', auth('Account'), getAllDataFabricator);
indexRoutes.get('/getAllDataElectrician', auth('Account'), getAllDataElectrician);
indexRoutes.get('/getAllDataTechnician', auth('Account'), getAllDataTechnician);

// Vendor Payment Routes

indexRoutes.post('/createVendorPayment', auth('Account'), createVendorPayment);
indexRoutes.get('/getAllVendorPayment', auth('Account'), getAllVendorPayment);
indexRoutes.get('/getVendorPaymentById/:id', auth('Account'), getVendorPaymentById);
indexRoutes.put('/updateVendorPayment/:id', auth('Account'), updateVendorPayment);
indexRoutes.delete('/deleteVendorPayment/:id', auth('Account'), deleteVendorPayment);
indexRoutes.get('/getAllPaymentVendor', auth('Account'), getAllPaymentVendor);

// Liasoniing Routes

indexRoutes.post('/createLiasonig', auth('Liasoning'), createLiasoning);
indexRoutes.get('/getAllLiasoning', auth('Liasoning'), getAllLiasoning);
indexRoutes.get('/getLiasoning/:id', auth('Liasoning'), getLiasoningById);
indexRoutes.put('/updateLiasoning/:id', auth('Liasoning'), upload.fields([{ name: "SitePhoto", maxCount: 1 }, { name: "OtherPhoto", maxCount: 1 }]), updateLiasoning);
indexRoutes.delete('/deleteLisoning/:id', auth('Liasoning'), deleteLiasoning);
indexRoutes.put('/updateStatus/:id', auth('Liasoning'), updateLiasoningStatus)

// Commercial Market Routes

indexRoutes.post('/createCommercialMarket', auth('Marketing'), upload.fields([{ name: "dealerImage", maxCount: 50 }]), createcommercialMarket);
indexRoutes.get('/getAllCommercialMarket', auth('Marketing'), getAllCommercialmarket);
indexRoutes.get('/getCommercialMarket/:id', auth('Marketing'), getCommercialMarketById);
indexRoutes.put('/updateCommercial/:id', auth('Marketing'), upload.fields([{ name: "dealerImage", maxCount: 50 }]), updateCommercialMarket);
indexRoutes.delete('/deleteCommercial/:id', auth('Marketing'), deleteCommercialMasrket);
indexRoutes.get('/getAllCommercialWarehouse', auth('Marketing'), getAllWarehouse);
indexRoutes.get('/getAllCommercialProduct', auth('Marketing'), getAllCommercialProduct);
indexRoutes.get('/getAllCommercialDealer', auth('Marketing'), getAllCommercialDealer);
indexRoutes.get('/getDealerData', auth('Marketing'), getAllDealerProduct);
indexRoutes.get('/allPendingDealerData', auth('Marketing'), getAllPendingDealerData)

// Purchase routes

indexRoutes.post('/CreatePurchase', auth('Purchase'), createNewPurchase);
indexRoutes.get('/getAllPurchase', auth('Purchase'), getAllPurchaseData);
indexRoutes.get('/getPurchaseData/:id', auth('Purchase'), getPurchaseById);
indexRoutes.put('/updatePurchase/:id', auth('Purchase'), updatePurchaseData);
indexRoutes.delete('/deletePurchase/:id', auth('Purchase'), deletePurchase);
indexRoutes.delete('/deletePurchaseDetails/:id', auth('Purchase'), deletePurchaseDetailsById);
indexRoutes.get('/getListCategoryInPurchase', auth('Purchase'), getAllPurchaseWarehouse);
indexRoutes.get('/getListProductInPurchase', auth('Purchase'), getAllPurchaseProduct);
indexRoutes.get('/getListVendorInPurchase', auth('Purchase'), getAllPurchaseVendor);
indexRoutes.get('/getTermsAndConditionData', auth('Purchase'), getAllTermsAndCondition)

// Transport Routes 

indexRoutes.post('/crateTarsport', auth('Dispatch'), createTrasportDetaile);
indexRoutes.get('/allTransportDetails', auth('Dispatch'), getAllTransportDetails);
indexRoutes.get('/getTransportDetails/:id', auth('Dispatch'), getTransportByID);
indexRoutes.put('/updateTransportDetails/:id', auth('Dispatch'), updateTransportDetails);
indexRoutes.delete('/deleteTransportDetails/:id', auth('Dispatch'), deleteTransportDetails);


// Slide Bar Category

indexRoutes.post('/creatSlidebarCategory', auth('SlideBar Category'), upload.fields([{ name: "slideBarImage", maxCount: 1 }, { name: "subcategoryimages", maxCount: 50 }]), createSlideBarCategory);
indexRoutes.get('/AllSlideBarCategory', auth('SlideBar Category'), getAllSlideBarCategory);
indexRoutes.get('/AllSlideBarCategoryByAdmin', auth('SlideBar Category'), getAllSlideBarCategoryByAdmin);
indexRoutes.get('/GetslideBarCategory/:id', auth('SlideBar Category'), getSlideBarCategory);
indexRoutes.put('/updateSlideBarCategory/:id', auth('SlideBar Category'), upload.fields([{ name: "slideBarImage", maxCount: 1 }, { name: "subcategoryimages", maxCount: 50 }]), updateSlideBarCategory);
indexRoutes.delete('/deleteSlideBarCategory/:id', auth('SlideBar Category'), deleteSlidBarCategory);
indexRoutes.get('/slideBarCategory', auth('SlideBar Category'), slideBarCategory);

//  TERMS & CONDITION

indexRoutes.post('/createTermsAndCondition', auth('Terms & Conditions'), createConditions);
indexRoutes.get('/allTermsAndConditions', auth('Terms & Conditions'), getAllConditions);
indexRoutes.get('/getTermsAndCondition/:id', auth('Terms & Conditions'), getConditionById);
indexRoutes.put('/updateTermsAndCondition/:id', auth('Terms & Conditions'), updateConditionById);
indexRoutes.delete('/deleteTermsAndCondition/:id', auth('Terms & Conditions'), deleteConditionById);

//  STORE

indexRoutes.post('/createstore', auth('Store'), upload.single('storeuploadFile'), createstore);
indexRoutes.get('/allstores', auth('Store'), getAllstore);
indexRoutes.get('/allstoreItem', auth('Store'), getAllstoreItems)
indexRoutes.get('/getstore/:id', auth('Store'), getstoreById);
indexRoutes.put('/updatestore/:id', auth('Store'), upload.single('storeuploadFile'), updatestoreById);
indexRoutes.delete('/deletestore/:id', auth('Store'), deletestoreById);
indexRoutes.get('/getWarehouse/:id', auth('Store'), getWarhouseData);
indexRoutes.post('/transferStore', auth('Store'), transferStore);
indexRoutes.get('/getstoreProduct', auth('Store'), getstoreProduct);
indexRoutes.get('/getstorepurchase', auth('Store'), getstorepurchase);
indexRoutes.get('/getstorewarehouse', auth('Store'), getstorewarehouse);
indexRoutes.get('/getstoreUsers', auth('Store'), getstoreUsers);

// Assign Installer Routes

indexRoutes.post('/createAssignInstaller', auth('Assign to Installer'), createAssignInstaller);
indexRoutes.get('/getAllAssignInstaller', auth('Assign to Installer'), getAllAssignInstaller);
indexRoutes.get('/getAssignInstallerById/:id', auth('Assign to Installer'), getAssignInstallerById);
indexRoutes.put('/updateAssignInstaller/:id', auth('Assign to Installer'), updateAssignInstaller);
indexRoutes.delete('/deleteAssignInstaller/:id', auth('Assign to Installer'), deleteAssignInstaller);
indexRoutes.get('/getLiaoningsdata', auth('Assign to Installer'), getAllLiaoningData)
indexRoutes.get('/getFabricator', auth('Assign to Installer'), getFabricator)
indexRoutes.get('/getElectrician', auth('Assign to Installer'), getElectrician)
indexRoutes.get('/getTechnician', auth('Assign to Installer'), getTechnician)
indexRoutes.get('/getUserinAssign', auth('Assign to Installer'), getUserinAssign)



// Fabricator Installer Routes

indexRoutes.post('/createFabricator', auth('Installer'), upload.fields([{ name: "fabricatorImage", maxCount: 50 }]), createFabricator);
indexRoutes.get('/getAllFabricator', auth('Installer'), getAllFabricator);
indexRoutes.get('/getFabricatorById/:id', auth('Installer'), getFabricatorById);
indexRoutes.put('/updateFabricator/:id', auth('Installer'), upload.fields([{ name: "fabricatorImage", maxCount: 50 }]), updateFabricator);
indexRoutes.delete('/deleteFabricator/:id', auth('Installer'), deleteFabricator);
indexRoutes.put('/updateFabricatorStatus/:id', auth('Installer'), updateFabricatorStatus);
indexRoutes.get('/getInstallerInFab', auth('Installer'), getAssignInFab);
indexRoutes.get('/getfabCategory', auth('Installer'), getfabCategory);
indexRoutes.get('/getfabSubCategory', auth('Installer'), getfabSubCategory);
indexRoutes.get('/getfabProduct', auth('Installer'), getfabProduct);
indexRoutes.get('/getfabUser', auth('Installer'), getfabUser);

// Electrician Installer Routes

indexRoutes.post('/createElectrician', auth('Installer'), upload.fields([{ name: "electricianImage", maxCount: 50 }]), createElectrician);
indexRoutes.get('/getAllElectrician', auth('Installer'), getAllElectrician);
indexRoutes.get('/getElectricianById/:id', auth('Installer'), getElectricianById);
indexRoutes.put('/updateElectrician/:id', auth('Installer'), upload.fields([{ name: "electricianImage", maxCount: 50 }]), updateElectrician);
indexRoutes.delete('/deleteElectrician/:id', auth('Installer'), deleteElectrician);
indexRoutes.put('/updateElectricianStatus/:id', auth('Installer'), updateElectricianStatus);
indexRoutes.get('/getInstallerInEle', auth('Installer'), getAssignInEle);
indexRoutes.get('/geteleCategory', auth('Installer'), geteleCategory);
indexRoutes.get('/geteleSubCategory', auth('Installer'), geteleSubCategory);
indexRoutes.get('/geteleProduct', auth('Installer'), geteleProduct);

// Technician Installer Routes

indexRoutes.post('/createTechnician', auth('Installer'), upload.fields([{ name: "technicianImage", maxCount: 50 }]), createTechnician);
indexRoutes.get('/getAllTechnician', auth('Installer'), getAllTechnician);
indexRoutes.get('/getTechnicianById/:id', auth('Installer'), getTechnicianById);
indexRoutes.put('/updateTechnician/:id', auth('Installer'), upload.fields([{ name: "technicianImage", maxCount: 50 }]), updateTechnician);
indexRoutes.put('/updateTechnicianStatus/:id', auth('Installer'), updateTechnicianStatus);
indexRoutes.get('/getInstallerInTech', auth('Installer'), getAssignInTech);
indexRoutes.get('/gettechCategory', auth('Installer'), gettechCategory);
indexRoutes.get('/gettechSubCategory', auth('Installer'), gettechSubCategory);
indexRoutes.get('/gettechProduct', auth('Installer'), gettechProduct);

// Bill Of Material Routes

indexRoutes.post('/createBillOfMaterial', auth('Bill Of Material'), createBom);
indexRoutes.get('/allBillOfMaterial', auth('Bill Of Material'), getAllBom);
indexRoutes.get('/getBomById/:id', auth('Bill Of Material'), getBomById);
indexRoutes.put('/updateBillOfMaterial/:id', auth('Bill Of Material'), updateBomById);
indexRoutes.delete('/deleteBillOfMaterial/:id', auth('Bill Of Material'), deleteBomById);
indexRoutes.get('/getBomCategory', auth('Bill Of Material'), getBomCategory);
indexRoutes.get('/getBomSubCategory', auth('Bill Of Material'), getBomSubCategory);
indexRoutes.get('/getBomProduct', auth('Bill Of Material'), getBomProduct);
indexRoutes.get('/getBomstore', auth('Bill Of Material'), getBomstore);

// Sales Routes

indexRoutes.post('/createSales', auth('Sales'), createSales);
indexRoutes.get('/allSales', auth('Sales'), getAllSales);
indexRoutes.get('/getSalesById/:id', auth('Sales'), getSalesById);
indexRoutes.put('/updateSales/:id', auth('Sales'), updateSalesById);
indexRoutes.delete('/deleteSales/:id', auth('Sales'), deleteSalesById);
indexRoutes.put('/updateSalesDetails/:id', auth('Sales'), updateSalesDetailsById);
indexRoutes.get('/getsalesCategory', auth('Sales'), getsalesCategory);
indexRoutes.get('/getsalesSubCategory', auth('Sales'), getsalesSubCategory);
indexRoutes.get('/getsalesProduct', auth('Sales'), getsalesProduct);
indexRoutes.get('/getsalesBom', auth('Sales'), getsalesBom);
indexRoutes.get('/getsalesTerms', auth('Sales'), getsalesTerms);

// view download image

indexRoutes.get('/proxy-image', async (req, res) => {
  console.log("req.query.url", req.query.url);
  const imageUrl = req.query.url;

  if (!imageUrl) {
    return res.status(400).send('Image URL is required');
  }

  try {
    const response = await axios({
      method: 'GET',
      url: imageUrl,
      responseType: 'stream'
    });

    res.setHeader('Content-Type', response.headers['content-type']);

    response.data.pipe(res);
  } catch (error) {
    console.error('Error proxying image:', error);
    res.status(500).send('Error fetching image');
  }
});

module.exports = indexRoutes;
