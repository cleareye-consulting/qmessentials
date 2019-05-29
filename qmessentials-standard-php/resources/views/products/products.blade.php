@extends('layouts/app')

@section('title','Products')

@section('content')
    <div class="container">
        <h2 class="subtitle">Products</h2>  
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Name</th>
                </tr>
            </thead>
            <tbody>
            @foreach($products as $product) 
                <tr>
                    <td><a href="/products/{{$product->product_id}}/edit">{{$product->product_name}}</a></td>
                </tr>
            @endforeach
            </tbody>
        </table>
        <div>
            <a href="/products/create">Add a Product</a>
        </div>
    </div>
@endsection