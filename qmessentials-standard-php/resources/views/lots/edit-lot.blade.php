@extends('layouts/app')

@section('title','Edit Lot')

@section('content')    
    <div class="container">
    <h2 class="subtitle">Edit Lot</h2>  
    <form class="form" action="/lots/{{$lot->lot_id}}" method="POST">
        {{csrf_field()}}
        <input type="hidden" id="lot_id" name="lot_id" value="{{$lot->lot_id}}"/>
        <input type="hidden" name="_method" value="PUT">
        <div class="form-group">
            <label class="control-label" for="lot_number">Lot Number</label>
            <input class="form-control" type="text" id="lot_number" name="lot_number" value="{{$lot->lot_number}}" disabled/>
        </div>
        <div class="form-group">
            <label class="control-label" for="product_id">Product</label>
            <select class="form-control" name="product_id" id="product_id">
                <option value="0">Select a Product...</option>
                @foreach ($products as $product)
                <option value="{{$product->product_id}}" {{$product->product_id == $lot->product_id ? 'selected' : ''}}>{{$product->product_name}}</option>
                @endforeach
            </select>
        </div>
        <div class="form-group">
            <label class="control-label" for="customer_name">Customer</label>
            <input class="form-control" type="text" id="customer_name" name="customer_name" value="{{$lot->customer_name}}"/>
        </div>        
        <div class="form-group">
            <button class="btn btn-primary">Save Changes</button>
            <a class="btn btn-default" href="/lots">Cancel</a>
        </div>
    </form>
    </div>
@endsection