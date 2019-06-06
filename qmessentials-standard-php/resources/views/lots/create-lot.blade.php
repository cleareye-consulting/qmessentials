@extends('layouts/app')

@section('title','Create Lot')

@section('content')    
    <div class="container">
    <h2 class="subtitle">Create Lot</h2>  
    <form class="form" action="/lots" method="POST">
        {{csrf_field()}}
        <div class="form-group">
            <label class="control-label" for="lot_number">Lot Number</label>
            <input class="form-control" type="text" id="lot_number" name="lot_number"/>
        </div>      
        <div class="form-group">
            <label class="control-label" for="product_id">Product</label>
            <select class="form-control" name="product_id" id="product_id">
                <option value="0">Select a Product...</option>
                @foreach ($products as $product)
                <option value="{{$product->product_id}}">{{$product->product_name}}</option>
                @endforeach
            </select>
        </div>
        <div class="form-group">
            <label class="control-label" for="customer_name">Customer</label>
            <input class="form-control" type="text" id="customer_name" name="customer_name"/>
        </div>
        <div class="form-group">
            <button class="btn btn-primary">Add Lot</button>
            <a class="btn btn-light" href="/lots">Cancel</a>
        </div>
    </form>
    </div>
@endsection