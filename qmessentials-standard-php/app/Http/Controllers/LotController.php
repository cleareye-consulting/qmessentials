<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LotController extends Controller
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
        $lots = DB::table('lot')
            ->join('product','lot.product_id','=','product.product_id')
            ->select('lot.lot_id', 'lot.lot_number', 'product.product_name', 'lot.customer_name', 'lot.created_date')
            ->get();
        return view('lots/lots', ['lots' => $lots]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $products = DB::table('product')->get();
        return view('lots/create-lot', ['products'=>$products]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        DB::table('lot')
            ->insert([
                'lot_number' => $request->input('lot_number'),
                'product_id' => $request->input('product_id'),
                'customer_name' => $request->input('customer_name'),
                'created_date' => date('Y-m-d H:i:s')
            ]);
        return redirect()->action('LotController@index');
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
    public function edit($id)
    {
        $lot = DB::table('lot')
            ->where('lot_id', $id)
            ->select('lot_id','lot_number','product_id','customer_name','created_date')
            ->first();
        $products = DB::table('product')->get();
        $items = DB::table('item')
            ->where('lot_id', $id)
            ->select('item_number', 'created_date')
            ->get();
        return view('lots/edit-lot', ['lot' => $lot, 'products' => $products, 'items' => $items]);
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
        DB::table('lot')
            ->where('lot_id', $id)
            ->update([
                'product_id' => $request->input('product_id'),
                'customer_name' => $request->input('customer_name')
            ]);
        if (!is_null($request->input('new_item_number'))) {
            DB::table('item')
                ->insert([
                    'item_number' => $request->input('new_item_number'),
                    'lot_id' => $id,
                    'created_date' => date('Y-m-d H:i:s')
                ]);
            return redirect()->action('LotController@edit', ['id' => $id]);
        }
        return redirect()->action('LotController@index');
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
