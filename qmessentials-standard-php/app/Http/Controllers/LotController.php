<?php

namespace App\Http\Controllers;

use App\Item;
use App\Lot;
use App\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

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
        $lots = Lot::whereIn('lot_status', ['New','Testing','Completed'])->get();
        return view('lots/lots', ['lots' => $lots]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        if (Gate::denies('write-lot')) {
            return redirect()->action('LotController@index');
        }
        $products = Product::all();
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
        if (Gate::denies('write-lot')) {
            return redirect()->action('LotController@index');
        }
        $lot = new Lot;
        $lot->lot_number = $request->lot_number;
        $lot->product_id = $request->product_id;
        $lot->customer_name = $request->customer_name;
        $lot->lot_status = 'New';
        $lot->save();
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
        if (Gate::denies('write-lot')) {
            return redirect()->action('LotController@index');
        }
        $lot = Lot::find($id);
        $products = Product::all();
        return view('lots/edit-lot', ['lot' => $lot, 'products' => $products]);
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
        if (Gate::denies('write-lot')) {
            return redirect()->action('LotController@index');
        }
        $lot = Lot::find($id);
        $lot->product_id = $request->product_id;
        $lot->customer_name = $request->customer_name;
        $lot->lot_status = $request->lot_status;
        $lot->save();        
        if (!is_null($request->new_item_number)) {
            $item = new Item;
            $item->item_number = $request->new_item_number;
            $item->lot_id = $id;
            $item->save();
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
