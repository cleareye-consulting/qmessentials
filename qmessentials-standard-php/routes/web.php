<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('index');
})->middleware('auth');

Route::get('/home', 'HomeController@index')->name('home')->middleware('auth');

Auth::routes();

Route::resources([
    'metrics' => 'MetricController',
    'lots' => 'LotController',
    'test-runs' => 'TestRunController',
    'users' => 'UserController'
]);

Route::resource('test-plans','TestPlanController')->except('edit');
Route::get('/test-plans/{id}/edit/{test_plan_metric_id_under_edit?}', 'TestPlanController@edit');

Route::resource('products','ProductController')->except('edit');
Route::get('/products/{id}/edit/{product_test_plan_id_under_edit?}', 'ProductController@edit');

Route::get('/api/available-qualifiers/{metric_id}', 'MetricController@getAvailableQualifiers');
Route::get('/api/available-units/{metric_id}', 'MetricController@getAvailableUnits');
Route::get('/api/items-for-lot/{lot_id}', 'TestRunController@getItemsForLot');
Route::get('/api/test-plans-for-item/{item_id}', 'TestRunController@getTestPlansForItem');

Route::get('/reports/results-by-lot/{lot_id?}', 'ReportController@resultsByLot');
