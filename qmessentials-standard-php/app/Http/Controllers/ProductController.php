<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
        $products = DB::table('product')->where('is_active',true)->get();
        return view('products/products', ['products' => $products]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
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
        DB::table('product')->insert([
            'product_name' => $request->input('product_name'),
            'is_active' => true
        ]);
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
        $product = DB::table('product')->where('product_id', $id)->select('product_id', 'product_name', 'is_active')->first();
        $product_test_plans = 
            DB::table('product_test_plan')
                ->join('test_plan', 'product_test_plan.test_plan_id', '=', 'test_plan.test_plan_id')
                ->where('product_test_plan.product_id', $id)
                ->select(['product_test_plan.product_test_plan_id','product_test_plan.test_plan_sequence_number', 
                    'product_test_plan.test_plan_id','test_plan.test_plan_name', 'product_test_plan.is_required'])
                ->orderby('product_test_plan.test_plan_sequence_number')
                ->get();
        $test_plans = DB::table('test_plan')->where('is_active',true)->select('test_plan_id','test_plan_name')->get();
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
        DB::table('product')
            ->where('product_id', $id)
            ->update(['is_active' => $request->input('is_active') == 'on']);        
        if ($request->input('new_product_test_plan_id') != 0) {
            $next_sequence_number = (DB::table('product_test_plan')
                ->where('product_id', $id)
                ->max('test_plan_sequence_number') ?? 0) + 1;
            DB::table('product_test_plan')
                ->insert([
                    'product_id' => $id, 
                    'test_plan_sequence_number' => $next_sequence_number,
                    'test_plan_id' => $request->input('new_product_test_plan_id'),                    
                    'is_required' => $request->input('new_product_test_plan_is_required') == 'on'
                ]);
            return redirect()->action('ProductController@edit', ['id' => $id]);
        }
        else if ($request->input('product_test_plan_id_under_edit') != 0) {
            DB::table('product_test_plan')
                ->where('product_test_plan_id', $request->input('product_test_plan_id_under_edit'))
                ->update([
                    'test_plan_id' => $request->input('edited_product_test_plan_id'),
                    'is_required' => $request->input('edited_product_test_plan_is_required') == 'on'
                ]);
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
        //
    }
}
