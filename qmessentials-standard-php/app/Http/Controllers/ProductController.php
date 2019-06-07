<?php

namespace App\Http\Controllers;

use App\Product;
use App\ProductTestPlan;
use App\TestPlan;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class ProductController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth');
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $products = Product::all();
        return view('products/products', ['products' => $products]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        if (Gate::denies('write-product')) {
            return redirect()->action('ProductController@index');
        }
        return view('products/create-product');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if (Gate::denies('write-product')) {
            return redirect()->action('ProductController@index');
        }
        $product = new Product;
        $product->product_name = $request->product_name;
        $product->save();
        return redirect()->action('ProductController@index');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id, $product_test_plan_id_under_edit = NULL)
    {
        if (Gate::denies('write-product')) {
            return redirect()->action('ProductController@index');
        }
        $product = Product::find($id);
        $product_test_plans = 
            ProductTestPlan::join('test_plan', 'product_test_plan.test_plan_id', '=', 'test_plan.test_plan_id')
                ->where('product_test_plan.product_id', $id)
                ->select(['product_test_plan.product_test_plan_id','product_test_plan.test_plan_sequence_number', 
                    'product_test_plan.test_plan_id','test_plan.test_plan_name', 'product_test_plan.is_required'])
                ->orderby('product_test_plan.test_plan_sequence_number')
                ->get();
        $test_plans = TestPlan::all();
        return view(
            'products/edit-product', [
                'product' => $product, 
                'product_test_plans' => $product_test_plans,
                'test_plans' => $test_plans,
                'product_test_plan_id_under_edit' => $product_test_plan_id_under_edit
            ]
        );
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        if (Gate::denies('write-product')) {
            return redirect()->action('ProductController@index');
        }
        if ($request->new_product_test_plan_id != 0) {
            $next_sequence_number = (ProductTestPlan::where('product_id', $id)->max('test_plan_sequence_number') ?? 0) + 1;
            $newProductTestPlan = new ProductTestPlan;
            $newProductTestPlan->product_id = $id;
            $newProductTestPlan->test_plan_seqence_number = $next_sequence_number;
            $newProductTestPlan->test_plan_id = $request->new_product_test_plan_id;
            $newProductTestPlan->is_required = $request->new_product_test_plan_is_required == 'on';
            $newProductTestPlan->save();
            return redirect()->action('ProductController@edit', ['id' => $id]);
        }
        else if ($request->input('product_test_plan_id_under_edit') != 0) {
            $editedProductTestPlan = ProductTestPlan::find($request->product_test_plan_id_under_edit);
            $editedProductTestPlan->test_plan_id = $request->edited_product_test_plan_id;
            $editedProductTestPlan->is_required = $request->edited_product_test_plan_is_required == 'on';
            $editedProductTestPlan->save();
            return redirect()->action('ProductController@edit', ['id' => $id]);
        }
        return redirect()->action('ProductController@index');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Product::destroy($id);
    }
}
