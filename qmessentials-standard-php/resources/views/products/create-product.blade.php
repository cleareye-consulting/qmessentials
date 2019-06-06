@extends('layouts/app')

@section('title','Create Product')

@section('content')    
    <div class="container">
    <h2 class="subtitle">Create Product</h2>  
    <form class="form" action="/products" method="POST">
        {{csrf_field()}}
        <div class="form-group">
            <label class="control-label" for="product_name">Name</label>
            <input class="form-control" type="text" id="product_name" name="product_name" placeholder="Name"/>
        </div>        
        <div class="form-group">
            <button class="btn btn-primary">Add Product</button>
            <a class="btn btn-outline-primary" href="/products">Cancel</a>
        </div>
    </form>
    </div>
@endsection